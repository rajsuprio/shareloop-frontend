import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

export default function Browse() {
  const [items, setItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentLocation, setCurrentLocation] = useState(
    () => localStorage.getItem("shareloopLocation") || "Nearby"
  );
  const [radius, setRadius] = useState(
    () => Number(localStorage.getItem("shareloopRadius")) || 10
  );
  const [recencyFilter, setRecencyFilter] = useState("Anytime");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  const { token, user } = useAuth();

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/items`);
      const data = await res.json();
      setItems(data);
    } catch {
      setBanner({
        type: "error",
        message: "Failed to load items from backend.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchSavedItems() {
    if (!token) {
      setSavedItems([]);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/saved-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) setSavedItems(data);
    } catch {}
  }

  useEffect(() => {
    fetchItems();
    fetchSavedItems();
  }, [token]);

  useEffect(() => {
    localStorage.setItem("shareloopLocation", currentLocation);
    localStorage.setItem("shareloopRadius", String(radius));
  }, [currentLocation, radius]);

  const parsePriceValue = (value) => {
    if (typeof value !== "string") return 0;
    const parsed = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(parsed) && /free|donate/i.test(value)) return 0;
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const recencyMatch = (item) => {
    if (!item.createdAt) return true;
    const ageMs = Date.now() - new Date(item.createdAt).getTime();
    switch (recencyFilter) {
      case "Last 24 hours":
        return ageMs <= 24 * 60 * 60 * 1000;
      case "Last 7 days":
        return ageMs <= 7 * 24 * 60 * 60 * 1000;
      case "Last 30 days":
        return ageMs <= 30 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  };

  const locationMatch = (item) => {
    if (!currentLocation || currentLocation === "Nearby") return true;
    const itemLocation = (item.location || "").toLowerCase();
    const query = currentLocation.toLowerCase();
    return (
      itemLocation.includes(query) ||
      (radius >= 25 && itemLocation.length > 0)
    );
  };

  const clearFilters = () => {
    setTypeFilter("All");
    setCategoryFilter("All");
    setRecencyFilter("Anytime");
    setPriceMin("");
    setPriceMax("");
    setRadius(10);
    setCurrentLocation("Nearby");
    setLocationSearch("");
  };

  async function handleDelete(id) {
    if (!token) {
      setBanner({
        type: "error",
        message: "You must be logged in to delete an item.",
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete item");

      setItems((prev) => prev.filter((item) => item._id !== id));

      await fetch(`${API_BASE_URL}/api/saved-items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});

      setSavedItems((prev) => prev.filter((item) => item.itemId?._id !== id));

      setBanner({
        type: "success",
        message: "Item deleted successfully.",
      });
    } catch (error) {
      setBanner({
        type: "error",
        message: error.message || "Delete failed.",
      });
    }
  }

  async function handleSave(item) {
    if (!token) {
      setBanner({
        type: "error",
        message: "You must be logged in to save items.",
      });
      return;
    }

    const alreadySaved = savedItems.some((saved) => saved.itemId?._id === item._id);

    try {
      if (alreadySaved) {
        const res = await fetch(`${API_BASE_URL}/api/saved-items/${item._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to remove saved item");

        setSavedItems((prev) => prev.filter((saved) => saved.itemId?._id !== item._id));
      } else {
        const res = await fetch(`${API_BASE_URL}/api/saved-items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId: item._id }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to save item");

        fetchSavedItems();
      }
    } catch (error) {
      setBanner({
        type: "error",
        message: error.message || "Save failed.",
      });
    }
  }

  const filteredItems = useMemo(() => {
    const minPrice = parseFloat(priceMin);
    const maxPrice = parseFloat(priceMax);

    return items.filter((item) => {
      const lowerSearch = search.toLowerCase();
      const itemTitle = item.title?.toLowerCase() || "";
      const itemLocation = item.location?.toLowerCase() || "";
      const itemCategory = item.category?.toLowerCase() || "";
      const itemType = item.type || "";
      const priceValue = parsePriceValue(item.price);

      const matchesSearch =
        itemTitle.includes(lowerSearch) ||
        itemLocation.includes(lowerSearch) ||
        itemCategory.includes(lowerSearch);

      const matchesType = typeFilter === "All" || itemType === typeFilter;
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const matchesLocation = locationMatch(item);
      const matchesRecency = recencyMatch(item);
      const matchesMinPrice = Number.isNaN(minPrice) || priceValue >= minPrice;
      const matchesMaxPrice = Number.isNaN(maxPrice) || priceValue <= maxPrice;
      const isAvailable = item.available !== false;

      return (
        isAvailable &&
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesLocation &&
        matchesRecency &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [items, search, typeFilter, categoryFilter, currentLocation, radius, recencyFilter, priceMin, priceMax]);

  return (
    <AppShell>
      <PageHeader
        title="Browse Items"
        description="Explore donated, sold, and borrowable items from your community."
        actions={
          <Link
            to="/saved"
            className="rounded-2xl bg-zinc-900 px-5 py-3 text-center text-white transition hover:bg-zinc-800"
          >
            View Saved
          </Link>
        }
      />

      {banner.message && (
        <div
          className={`mt-6 status-banner ${
            banner.type === "success"
              ? "status-banner--success"
              : "status-banner--error"
          }`}
        >
          {banner.message}
        </div>
      )}

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Discovery area</p>
              <h3 className="mt-2 text-xl font-semibold text-zinc-900">
                {currentLocation === "Nearby" ? "Nearby discoveries" : `Near ${currentLocation}`}
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Showing items from your community within roughly {radius} km.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setLocationModalOpen(true)}
                className="btn-secondary"
              >
                Set location
              </button>
              <button
                onClick={() => setFilterModalOpen(true)}
                className="btn-primary"
              >
                Advanced filters
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-zinc-50 p-4 text-sm text-zinc-600">
            Approximate public location is used for discovery. Exact pickup details should only be shared later through messages after both users agree.
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Search & filter</p>
              <h3 className="mt-2 text-xl font-semibold text-zinc-900">Search items</h3>
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-zinc-600 underline decoration-dotted underline-offset-2 hover:text-zinc-900"
            >
              Reset filters
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Search by title, location, or category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
            />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="All">All Types</option>
              <option value="Donate">Donate</option>
              <option value="Sell">Sell</option>
              <option value="Borrow">Borrow</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothes">Clothes</option>
              <option value="Furniture">Furniture</option>
              <option value="Books">Books</option>
              <option value="Essentials">Essentials</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 transition-opacity ${
          locationModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className={`w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl transition-transform duration-300 ease-out ${locationModalOpen ? "translate-y-0" : "-translate-y-6"}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Select your approximate location</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Enter a city or neighborhood for discovery. This helps surface nearby items without sharing exact pickup details.
              </p>
            </div>
            <button
              onClick={() => setLocationModalOpen(false)}
              className="rounded-full bg-zinc-100 p-2 text-zinc-700 transition hover:bg-zinc-200"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search location, e.g. Downtown, City Center"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="input-field"
              />
              <div className="rounded-3xl bg-zinc-50 p-4 text-sm text-zinc-600">
                Current discovery location: <span className="font-semibold text-zinc-900">{currentLocation}</span>
                <br />
                Radius: <span className="font-semibold text-zinc-900">{radius} km</span>
              </div>
              <div className="rounded-3xl bg-zinc-100 p-4 text-sm text-zinc-600">
                Tip: If you leave location empty or choose Nearby, we show all community items here.
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-zinc-900">Radius</span>
                <span className="text-sm text-zinc-500">{radius} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full"
              />
              <div className="mt-4 grid gap-2 text-sm text-zinc-500">
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                  Use a larger radius to broaden discovery when you want more item options.
                </div>
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                  Use a smaller radius for nearby pickup items only.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (locationSearch.trim()) {
                  setCurrentLocation(locationSearch.trim());
                }
                setLocationModalOpen(false);
              }}
              className="btn-primary"
            >
              Apply location
            </button>
            <button
              onClick={() => {
                setCurrentLocation("Nearby");
                setLocationSearch("");
                setLocationModalOpen(false);
              }}
              className="btn-secondary"
            >
              Use Nearby
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 transition-opacity ${
          filterModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className={`w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl transition-transform duration-300 ease-out ${filterModalOpen ? "translate-y-0" : "-translate-y-6"}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Advanced filters</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Refine your search by type, timeframe, price, and location radius.
              </p>
            </div>
            <button
              onClick={() => setFilterModalOpen(false)}
              className="rounded-full bg-zinc-100 p-2 text-zinc-700 transition hover:bg-zinc-200"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-zinc-900">Recency</label>
              <select
                value={recencyFilter}
                onChange={(e) => setRecencyFilter(e.target.value)}
                className="input-field mt-3"
              >
                <option>Anytime</option>
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-zinc-900">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input-field mt-3"
              >
                <option value="All">All Types</option>
                <option value="Donate">Donate</option>
                <option value="Sell">Sell</option>
                <option value="Borrow">Borrow</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-zinc-900">Price min</label>
              <input
                type="number"
                min="0"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="0"
                className="input-field mt-3"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-zinc-900">Price max</label>
              <input
                type="number"
                min="0"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="No limit"
                className="input-field mt-3"
              />
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
            <p className="font-semibold text-zinc-900">Current location filter</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-white px-3 py-2 text-zinc-700 shadow-sm">{currentLocation}</span>
              <span className="rounded-full bg-white px-3 py-2 text-zinc-700 shadow-sm">{radius} km radius</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFilterModalOpen(false)}
              className="btn-primary"
            >
              Apply filters
            </button>
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-zinc-500">Loading items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-zinc-500">No matching items found.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const isSaved = savedItems.some((saved) => saved.itemId?._id === item._id);
            const isOwner = user && item.user && user._id === item.user._id;

            return (
              <div
                key={item._id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link to={`/item/${item._id}`} className="block">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-zinc-900">
                          {item.title}
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500">
                          📍 {item.location}
                        </p>
                        {item.user?.name && (
                          <p className="mt-1 text-xs text-zinc-400">
                            Posted by {item.user.name}
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-zinc-900">
                        {item.price}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">
                        {item.type}
                      </span>
                      <span className="text-sm text-zinc-500">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2">
                  <button
                    onClick={() => handleSave(item)}
                    className={`w-full rounded-2xl px-4 py-2 text-white transition ${
                      isSaved
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {isSaved ? "Saved" : "Save Item"}
                  </button>

                  {isOwner ? (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="w-full rounded-2xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                    >
                      Delete Item
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-2xl bg-zinc-300 px-4 py-2 text-white"
                    >
                      Not Yours
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
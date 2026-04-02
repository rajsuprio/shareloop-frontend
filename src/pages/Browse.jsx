import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";

export default function Browse() {
  const [items, setItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const savedPostedItems =
      JSON.parse(localStorage.getItem("shareloopItems")) || [];
    const savedFavorites =
      JSON.parse(localStorage.getItem("shareloopSavedItems")) || [];

    setItems(savedPostedItems);
    setSavedItems(savedFavorites);
  }, []);

  function handleDelete(id) {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem("shareloopItems", JSON.stringify(updatedItems));

    const updatedSaved = savedItems.filter((item) => item.id !== id);
    setSavedItems(updatedSaved);
    localStorage.setItem("shareloopSavedItems", JSON.stringify(updatedSaved));
  }

  function handleSave(item) {
    const alreadySaved = savedItems.some((saved) => saved.id === item.id);

    if (alreadySaved) {
      const updatedSaved = savedItems.filter((saved) => saved.id !== item.id);
      setSavedItems(updatedSaved);
      localStorage.setItem("shareloopSavedItems", JSON.stringify(updatedSaved));
    } else {
      const updatedSaved = [item, ...savedItems];
      setSavedItems(updatedSaved);
      localStorage.setItem("shareloopSavedItems", JSON.stringify(updatedSaved));
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "All" || item.type === typeFilter;
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [items, search, typeFilter, categoryFilter]);

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

      <div className="mt-8 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search by title, location, or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="All">All Types</option>
            <option value="Donate">Donate</option>
            <option value="Sell">Sell</option>
            <option value="Borrow">Borrow</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
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

      {filteredItems.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-zinc-500">No matching items found.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const isSaved = savedItems.some((saved) => saved.id === item.id);

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link to={`/item/${item.id}`} className="block">
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

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-full rounded-2xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                  >
                    Delete Item
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
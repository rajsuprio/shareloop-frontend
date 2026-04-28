import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

export default function SavedItems() {
  const { token, user } = useAuth();
  const [savedItems, setSavedItems] = useState([]);
  const [banner, setBanner] = useState({ type: "", message: "" });

  async function fetchSavedItems() {
    if (!token) {
      setBanner({
        type: "error",
        message: "You must be logged in to view saved items.",
      });
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

      if (!res.ok) throw new Error(data.message || "Failed to fetch saved items");

      setSavedItems(data);
    } catch (error) {
      setBanner({
        type: "error",
        message: error.message,
      });
    }
  }

  useEffect(() => {
    fetchSavedItems();
  }, [token]);

  async function handleRemove(itemId) {
    if (!token) {
      setBanner({
        type: "error",
        message: "You must be logged in to remove saved items.",
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/saved-items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to remove saved item");

      setSavedItems((prev) => prev.filter((item) => item.itemId?._id !== itemId));
    } catch (error) {
      setBanner({
        type: "error",
        message: error.message,
      });
    }
  }

  async function handleClearAll() {
    if (!token) {
      setBanner({
        type: "error",
        message: "You must be logged in to clear saved items.",
      });
      return;
    }

    for (const saved of savedItems) {
      await fetch(`${API_BASE_URL}/api/saved-items/${saved.itemId?._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    setSavedItems([]);
  }

  return (
    <AppShell>
      <PageHeader
        title="Saved Items"
        description={
          user
            ? `Items saved by ${user.name}.`
            : "Items you saved for later browsing or contact."
        }
        actions={
          <div className="flex flex-wrap gap-3">
            <Link
              to="/browse"
              className="rounded-2xl bg-zinc-900 px-5 py-3 text-white transition hover:bg-zinc-800"
            >
              Browse More
            </Link>
            {savedItems.length > 0 && (
              <button
                onClick={handleClearAll}
                className="rounded-2xl bg-red-500 px-5 py-3 text-white transition hover:bg-red-600"
              >
                Clear All
              </button>
            )}
          </div>
        }
      />

      {banner.message && (
        <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
          {banner.message}
        </div>
      )}

      {savedItems.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-2xl">
            ♡
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-zinc-900">
            No saved items yet
          </h2>
          <p className="mt-3 text-zinc-600">
            Save items from the browse page to revisit them later.
          </p>

          <Link
            to="/browse"
            className="mt-6 inline-block rounded-2xl bg-green-500 px-5 py-3 text-white transition hover:bg-green-600"
          >
            Go to Browse
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {savedItems.map((saved) => {
            const item = saved.itemId;
            if (!item) return null;

            return (
              <div
                key={saved._id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link to={`/item/${item._id}`} className="block">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-56 w-full object-cover"
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
                      <span className="font-bold text-zinc-900">{item.price}</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">
                        {item.type}
                      </span>
                      <span className="text-sm text-zinc-500">{item.category}</span>
                    </div>
                  </div>
                </Link>

                <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2">
                  <Link
                    to={`/item/${item._id}`}
                    className="rounded-2xl bg-zinc-900 px-4 py-2 text-center text-white transition hover:bg-zinc-800"
                  >
                    View Item
                  </Link>

                  <button
                    onClick={() => handleRemove(item._id)}
                    className="rounded-2xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                  >
                    Remove
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
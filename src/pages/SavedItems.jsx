import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SavedItems() {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shareloopSavedItems")) || [];
    setSavedItems(saved);
  }, []);

  function handleRemove(id) {
    const updated = savedItems.filter((item) => item.id !== id);
    setSavedItems(updated);
    localStorage.setItem("shareloopSavedItems", JSON.stringify(updated));
  }

  function handleClearAll() {
    const confirmed = window.confirm("Are you sure you want to remove all saved items?");
    if (!confirmed) return;

    setSavedItems([]);
    localStorage.setItem("shareloopSavedItems", JSON.stringify([]));
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-zinc-900">Saved Items</h1>
              <p className="mt-3 text-zinc-600">
                Items you saved for later browsing or contact.
              </p>
            </div>

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
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-sm text-zinc-500">Total Saved</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">
                {savedItems.length}
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-sm text-zinc-500">Status</p>
              <p className="mt-1 text-2xl font-bold text-green-600">Active</p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-sm text-zinc-500">Storage</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">Local</p>
            </div>
          </div>
        </div>

        {savedItems.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-10 shadow-sm text-center">
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
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link to={`/item/${item.id}`} className="block">
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
                    to={`/item/${item.id}`}
                    className="rounded-2xl bg-zinc-900 px-4 py-2 text-center text-white transition hover:bg-zinc-800"
                  >
                    View Item
                  </Link>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="rounded-2xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
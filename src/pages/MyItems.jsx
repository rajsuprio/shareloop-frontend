import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("shareloopItems")) || [];
    setItems(savedItems);
  }, []);

  function handleDelete(id) {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem("shareloopItems", JSON.stringify(updatedItems));

    const savedFavorites =
      JSON.parse(localStorage.getItem("shareloopSavedItems")) || [];
    const updatedFavorites = savedFavorites.filter((item) => item.id !== id);
    localStorage.setItem("shareloopSavedItems", JSON.stringify(updatedFavorites));
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-zinc-900">My Items</h1>
          <p className="mt-3 text-zinc-600">
            Manage the items you have posted on ShareLoop.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-sm text-zinc-500">Total Posted</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">{items.length}</p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-sm text-zinc-500">Saved Locally</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">Yes</p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-sm text-zinc-500">Status</p>
              <p className="mt-1 text-2xl font-bold text-green-600">Active</p>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-zinc-900">No items yet</h2>
            <p className="mt-3 text-zinc-600">
              You have not posted anything yet.
            </p>

            <Link
              to="/post"
              className="mt-6 inline-block rounded-2xl bg-green-500 px-5 py-3 text-white transition hover:bg-green-600"
            >
              Post Your First Item
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
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

                <div className="grid gap-3 px-5 pb-5 sm:grid-cols-3">
                  <Link
                    to={`/item/${item.id}`}
                    className="rounded-2xl bg-zinc-900 px-4 py-2 text-center text-white transition hover:bg-zinc-800"
                  >
                    View
                  </Link>

                  <Link
                    to={`/post?edit=${item.id}`}
                    className="rounded-2xl bg-blue-500 px-4 py-2 text-center text-white transition hover:bg-blue-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-2xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                  >
                    Delete
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
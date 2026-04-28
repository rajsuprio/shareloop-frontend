import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

export default function MyItems() {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  async function fetchMyItems() {
    if (!token) {
      setBanner({
        type: "error",
        message: "You must be logged in to view your items.",
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/items/my-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load your items");
      }

      setItems(data);
    } catch (error) {
      setBanner({
        type: "error",
        message: error.message || "Failed to load your items.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyItems();
  }, [token]);

  async function handleDelete(id) {
    if (!token) {
      setBanner({
        type: "error",
        message: "You must be logged in to delete your item.",
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

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setItems((prev) => prev.filter((item) => item._id !== id));

      await fetch(`${API_BASE_URL}/api/saved-items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});
      await fetch(`${API_BASE_URL}/api/requests/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});

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

  return (
    <AppShell>
      <PageHeader
        title="My Items"
        description={
          user
            ? `Manage the items posted by ${user.name}.`
            : "Manage the items you have posted on ShareLoop."
        }
      />

      {banner.message && (
        <div
          className={`mt-6 rounded-2xl p-4 text-sm font-medium ${
            banner.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {banner.message}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-500">My Total Posted</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{items.length}</p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-500">Storage</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">MongoDB</p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-500">Status</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {token ? "Logged In" : "Logged Out"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-zinc-500">Loading your items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-zinc-900">No items yet</h2>
          <p className="mt-3 text-zinc-600">
            You have not posted any items from this account yet.
          </p>

          <Link
            to="/post"
            className="mt-6 inline-block rounded-2xl bg-green-500 px-5 py-3 text-white transition hover:bg-green-600"
          >
            Post Your First Item
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item._id}
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
                  to={`/item/${item._id}`}
                  className="rounded-2xl bg-zinc-900 px-4 py-2 text-center text-white transition hover:bg-zinc-800"
                >
                  View
                </Link>

                <Link
                  to={`/post?edit=${item._id}`}
                  className="rounded-2xl bg-blue-500 px-4 py-2 text-center text-white transition hover:bg-blue-600"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="rounded-2xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
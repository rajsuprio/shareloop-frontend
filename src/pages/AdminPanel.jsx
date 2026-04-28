import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const { token } = useAuth();

  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState({ type: "", message: "" });

  async function fetchAdminData() {
    try {
      setLoading(true);

      const [summaryRes, usersRes, itemsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/admin/items`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const summaryData = await summaryRes.json();
      const usersData = await usersRes.json();
      const itemsData = await itemsRes.json();

      if (!summaryRes.ok) throw new Error(summaryData.message || "Failed to load summary");
      if (!usersRes.ok) throw new Error(usersData.message || "Failed to load users");
      if (!itemsRes.ok) throw new Error(itemsData.message || "Failed to load items");

      setSummary(summaryData.summary);
      setUsers(usersData);
      setItems(itemsData);
    } catch (error) {
      setBanner({
        type: "error",
        message: error.message || "Failed to load admin panel.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function handleRoleChange(userId, role) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, role } : user))
      );

      setBanner({
        type: "success",
        message: "User role updated successfully.",
      });
    } catch (error) {
      setBanner({
        type: "error",
        message: error.message || "Failed to update role.",
      });
    }
  }

  async function handleDeleteItem(itemId) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete item");
      }

      setItems((prev) => prev.filter((item) => item._id !== itemId));
      setBanner({
        type: "success",
        message: "Item deleted successfully.",
      });
    } catch (error) {
      setBanner({
        type: "error",
        message: error.message || "Failed to delete item.",
      });
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Admin Panel"
        description="Moderation and role management for ShareLoop."
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

      {loading ? (
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-zinc-500">Loading admin panel...</p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-zinc-500">Total Users</p>
              <h2 className="mt-2 text-3xl font-bold text-zinc-900">
                {summary?.usersCount || 0}
              </h2>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-zinc-500">Total Items</p>
              <h2 className="mt-2 text-3xl font-bold text-zinc-900">
                {summary?.itemsCount || 0}
              </h2>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-zinc-500">Total Requests</p>
              <h2 className="mt-2 text-3xl font-bold text-zinc-900">
                {summary?.requestsCount || 0}
              </h2>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-zinc-900">Users</h2>

            <div className="mt-6 space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-zinc-900">{user.name}</p>
                    <p className="text-sm text-zinc-500">{user.email}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-500">Role</span>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="rounded-xl border border-zinc-300 bg-white px-3 py-2"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="moderator">moderator</option>
                      <option value="organization">organization</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-zinc-900">Items Moderation</h2>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-zinc-900">{item.title}</p>
                    <p className="text-sm text-zinc-500">
                      Owner: {item.user?.name || "Unknown"} · {item.category} · {item.type}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="rounded-2xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                  >
                    Delete Item
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
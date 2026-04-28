import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { token, user, logout } = useAuth();

  const [myItems, setMyItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      if (!token) {
        setBanner({
          type: "error",
          message: "You must be logged in to view your profile.",
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [itemsRes, savedRes, requestsRes, receivedRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/items/my-items`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/saved-items`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/requests`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/requests/received`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const itemsData = await itemsRes.json();
        const savedData = await savedRes.json();
        const requestsData = await requestsRes.json();
        const receivedData = await receivedRes.json();

        if (!itemsRes.ok) throw new Error(itemsData.message || "Failed to load profile items.");
        if (!savedRes.ok) throw new Error(savedData.message || "Failed to load saved items.");
        if (!requestsRes.ok) throw new Error(requestsData.message || "Failed to load requests.");
        if (!receivedRes.ok) throw new Error(receivedData.message || "Failed to load received requests.");

        setMyItems(itemsData);
        setSavedItems(savedData);
        setMyRequests(requestsData);
        setReceivedRequests(receivedData);
      } catch (error) {
        setBanner({
          type: "error",
          message: error.message || "Failed to load profile data.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [token]);

  return (
    <AppShell>
      <PageHeader
        title="My Profile"
        description="View your account details and activity summary."
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
          <p className="text-zinc-500">Loading profile...</p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-2xl font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-zinc-900">
                    {user?.name || "User"}
                  </h2>
                  <p className="text-sm text-zinc-500">{user?.email || "No email"}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-sm text-zinc-500">Role</p>
                  <p className="mt-1 text-lg font-semibold capitalize text-zinc-900">
                    {user?.role || "user"}
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-sm text-zinc-500">Account Status</p>
                  <p className="mt-1 text-lg font-semibold text-green-600">Active</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="mt-6 w-full rounded-2xl border border-zinc-300 bg-white px-5 py-3 font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                Logout
              </button>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-zinc-900">Activity Summary</h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-sm text-zinc-500">My Posted Items</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">{myItems.length}</p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-sm text-zinc-500">Saved Items</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">{savedItems.length}</p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-sm text-zinc-500">Requests Made</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">{myRequests.length}</p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-sm text-zinc-500">Requests Received</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">{receivedRequests.length}</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-zinc-50 p-4">
                <p className="text-sm text-zinc-500">Accepted Requests Received</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900">
                  {receivedRequests.filter((req) => req.status === "accepted").length}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-zinc-900">Recent My Items</h2>

              {myItems.length === 0 ? (
                <p className="mt-4 text-zinc-500">No items posted yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {myItems.slice(0, 4).map((item) => (
                    <div
                      key={item._id}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                    >
                      <p className="font-semibold text-zinc-900">{item.title}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {item.type} · {item.price} · {item.location}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-zinc-900">Recent My Requests</h2>

              {myRequests.length === 0 ? (
                <p className="mt-4 text-zinc-500">No requests made yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {myRequests.slice(0, 4).map((req) => (
                    <div
                      key={req._id}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                    >
                      <p className="font-semibold text-zinc-900">
                        {req.itemId?.title || "Item"}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500 capitalize">
                        Status: {req.status}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
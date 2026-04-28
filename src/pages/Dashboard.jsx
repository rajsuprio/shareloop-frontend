import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [postedItems, setPostedItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [banner, setBanner] = useState({ type: "", message: "" });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const itemsRes = await fetch(`${API_BASE_URL}/api/items`);
        const itemsData = await itemsRes.json();

        if (!itemsRes.ok) throw new Error("Failed to load dashboard items.");

        setPostedItems(itemsData);

        if (!token) {
          setSavedItems([]);
          setRequests([]);
          setReceivedRequests([]);
          return;
        }

        const [savedRes, requestsRes, receivedRes] = await Promise.all([
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

        const savedData = await savedRes.json();
        const requestsData = await requestsRes.json();
        const receivedData = await receivedRes.json();

        if (!savedRes.ok) {
          throw new Error(savedData.message || "Failed to load saved items.");
        }
        if (!requestsRes.ok) {
          throw new Error(requestsData.message || "Failed to load requests.");
        }
        if (!receivedRes.ok) {
          throw new Error(receivedData.message || "Failed to load received requests.");
        }

        setSavedItems(savedData);
        setRequests(requestsData);
        setReceivedRequests(receivedData);
      } catch (error) {
        setBanner({
          type: "error",
          message: error.message || "Failed to load dashboard data.",
        });
      }
    }

    fetchDashboardData();
  }, [token]);

  const totalRequests = requests.length;
  const totalBorrowRequests = requests.filter(
    (req) => req.days || req.returnDate
  ).length;
  const pendingReceived = receivedRequests.filter((req) => req.status === "pending").length;

  const totalDonateItems = postedItems.filter((item) => item.type === "Donate").length;
  const totalSellItems = postedItems.filter((item) => item.type === "Sell").length;
  const totalBorrowItems = postedItems.filter((item) => item.type === "Borrow").length;

  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description={
          user
            ? `Welcome back, ${user.name}. Here is your ShareLoop activity overview.`
            : "Explore overall ShareLoop activity. Log in to see your personal request stats."
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

      {!user && (
        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-900">Log in for your personal dashboard</h2>
          <p className="mt-2 text-zinc-600">
            You can still explore item statistics, but login is needed to view your saved items and requests.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-2xl bg-zinc-900 px-5 py-3 text-white transition hover:bg-zinc-800"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-2xl bg-green-500 px-5 py-3 text-white transition hover:bg-green-600"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Total Posted Items</p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-900">
            {postedItems.length}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">
            {user ? "My Saved Items" : "Saved Items"}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-900">
            {user ? savedItems.length : "—"}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">
            {user ? "My Requests" : "Requests"}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-900">
            {user ? totalRequests : "—"}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">
            {user ? "My Borrow Requests" : "Borrow Requests"}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-900">
            {user ? totalBorrowRequests : "—"}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">
            {user ? "Requests Received" : "Requests Received"}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-900">
            {user ? pendingReceived : "—"}
          </h2>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-zinc-900">
            Item Type Breakdown
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-sm text-zinc-500">Donate Items</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {totalDonateItems}
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-sm text-zinc-500">Sell Items</p>
              <p className="mt-1 text-2xl font-bold text-orange-500">
                {totalSellItems}
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-sm text-zinc-500">Borrow Items</p>
              <p className="mt-1 text-2xl font-bold text-blue-500">
                {totalBorrowItems}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-zinc-900">
            Quick Actions
          </h2>

          <div className="mt-6 grid gap-4">
            {user ? (
              <>
                <Link
                  to="/post"
                  className="rounded-2xl bg-green-500 px-5 py-4 text-center text-white transition hover:bg-green-600"
                >
                  Post a New Item
                </Link>

                <Link
                  to="/my-items"
                  className="rounded-2xl bg-blue-500 px-5 py-4 text-center text-white transition hover:bg-blue-600"
                >
                  Manage My Items
                </Link>

                <Link
                  to="/saved"
                  className="rounded-2xl bg-yellow-500 px-5 py-4 text-center text-white transition hover:bg-yellow-600"
                >
                  View Saved Items
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/browse"
                  className="rounded-2xl bg-zinc-900 px-5 py-4 text-center text-white transition hover:bg-zinc-800"
                >
                  Browse All Items
                </Link>

                <Link
                  to="/login"
                  className="rounded-2xl bg-green-500 px-5 py-4 text-center text-white transition hover:bg-green-600"
                >
                  Login to Start Posting
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {user && receivedRequests.length > 0 && (
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-zinc-900">
            Recent Requests Received
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {receivedRequests.slice(0, 4).map((req) => (
              <div
                key={req._id}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
              >
                <p className="text-lg font-semibold text-zinc-900">
                  {req.itemId?.title || "Item"}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Requested by {req.requester?.name || "Unknown"}
                </p>
                <p className="mt-2 text-sm text-zinc-600 capitalize">
                  Status: {req.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-zinc-900">
          Recently Posted Items
        </h2>

        {postedItems.length === 0 ? (
          <p className="mt-4 text-zinc-500">No items posted yet.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {postedItems.slice(0, 6).map((item) => (
              <Link
                key={item._id}
                to={`/item/${item._id}`}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:bg-zinc-100"
              >
                <h3 className="text-lg font-semibold text-zinc-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  📍 {item.location}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-full bg-white px-3 py-1 text-sm text-zinc-700">
                    {item.type}
                  </span>
                  <span className="font-medium text-zinc-900">
                    {item.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [postedItems, setPostedItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [requests, setRequests] = useState({});

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("shareloopItems")) || [];
    const saved = JSON.parse(localStorage.getItem("shareloopSavedItems")) || [];
    const storedRequests =
      JSON.parse(localStorage.getItem("shareloopRequests")) || {};

    setPostedItems(items);
    setSavedItems(saved);
    setRequests(storedRequests);
  }, []);

  const totalRequests = Object.keys(requests).length;

  const totalBorrowRequests = Object.values(requests).filter(
    (req) => req.borrowDetails
  ).length;

  const totalDonateItems = postedItems.filter(
    (item) => item.type === "Donate"
  ).length;

  const totalSellItems = postedItems.filter(
    (item) => item.type === "Sell"
  ).length;

  const totalBorrowItems = postedItems.filter(
    (item) => item.type === "Borrow"
  ).length;

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 sm:px-6 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Dashboard</h1>
          <p className="mt-3 text-zinc-600">
            Overview of your ShareLoop activity and item statistics.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">Total Posted Items</p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-900">
              {postedItems.length}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">Saved Items</p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-900">
              {savedItems.length}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">Total Requests</p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-900">
              {totalRequests}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">Borrow Requests</p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-900">
              {totalBorrowRequests}
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
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
              <Link
                to="/post"
                className="rounded-2xl bg-green-500 px-5 py-4 text-center text-white transition hover:bg-green-600"
              >
                Post a New Item
              </Link>

              <Link
                to="/browse"
                className="rounded-2xl bg-zinc-900 px-5 py-4 text-center text-white transition hover:bg-zinc-800"
              >
                Browse All Items
              </Link>

              <Link
                to="/saved"
                className="rounded-2xl bg-yellow-500 px-5 py-4 text-center text-white transition hover:bg-yellow-600"
              >
                View Saved Items
              </Link>

              <Link
                to="/my-items"
                className="rounded-2xl bg-blue-500 px-5 py-4 text-center text-white transition hover:bg-blue-600"
              >
                Manage My Items
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-zinc-900">
            Recently Posted Items
          </h2>

          {postedItems.length === 0 ? (
            <p className="mt-4 text-zinc-500">No items posted yet.</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {postedItems.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  to={`/item/${item.id}`}
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
      </div>
    </div>
  );
}
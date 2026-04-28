import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

export default function Requests() {
  const { token, user } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("made");
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  async function fetchRequests() {
    if (!token) {
      setBanner({
        type: "error",
        message: "You must be logged in to view requests.",
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [madeRes, receivedRes] = await Promise.all([
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

      const madeData = await madeRes.json();
      const receivedData = await receivedRes.json();

      if (!madeRes.ok) {
        throw new Error(madeData.message || "Failed to load your requests.");
      }

      if (!receivedRes.ok) {
        throw new Error(receivedData.message || "Failed to load received requests.");
      }

      setMyRequests(madeData);
      setReceivedRequests(receivedData);
    } catch (error) {
      setBanner({
        type: "error",
        message: error.message || "Failed to load requests.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, [token]);

  function showBanner(type, message) {
    setBanner({ type, message });
    setTimeout(() => {
      setBanner({ type: "", message: "" });
    }, 2000);
  }

  async function updateRequestStatus(requestId, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/requests/${requestId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update request.");
      }

      setReceivedRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status } : req
        )
      );

      setMyRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status } : req
        )
      );

      showBanner("success", `Request ${status} successfully.`);
    } catch (error) {
      showBanner("error", error.message || "Status update failed.");
    }
  }

  async function cancelMyRequestByItem(itemId, requestId) {
    try {
      let res;
      let data;

      if (requestId) {
        res = await fetch(`${API_BASE_URL}/api/requests/${requestId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "cancelled" }),
        });
        data = await res.json();
      } else {
        res = await fetch(`${API_BASE_URL}/api/requests/${itemId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel request.");
      }

      setMyRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: "cancelled" } : req
        )
      );

      showBanner("success", "Request cancelled successfully.");
    } catch (error) {
      showBanner("error", error.message || "Cancel failed.");
    }
  }

  const statusBadgeClass = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "cancelled":
        return "bg-zinc-200 text-zinc-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const RequestCard = ({ req, type }) => {
    const item = req.itemId;

    return (
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-semibold text-zinc-900">
                {item?.title || "Item"}
              </h3>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${statusBadgeClass(
                  req.status
                )}`}
              >
                {req.status}
              </span>
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              📍 {item?.location || "Unknown location"}
            </p>

            <p className="mt-2 text-sm text-zinc-600">
              Type: <span className="font-medium">{item?.type || "Unknown"}</span>
            </p>

            {type === "made" ? (
              <p className="mt-2 text-sm text-zinc-600">
                Owner:{" "}
                <span className="font-medium">
                  {req.owner?.name || "Unknown"} ({req.owner?.email || "No email"})
                </span>
              </p>
            ) : (
              <p className="mt-2 text-sm text-zinc-600">
                Requester:{" "}
                <span className="font-medium">
                  {req.requester?.name || "Unknown"} ({req.requester?.email || "No email"})
                </span>
              </p>
            )}

            {req.days ? (
              <p className="mt-2 text-sm text-zinc-600">
                Duration: <span className="font-medium">{req.days} day(s)</span>
              </p>
            ) : null}

            {req.returnDate ? (
              <p className="mt-2 text-sm text-zinc-600">
                Return date: <span className="font-medium">{req.returnDate}</span>
              </p>
            ) : null}

            {req.note ? (
              <p className="mt-2 text-sm text-zinc-600">
                Note: <span className="font-medium">{req.note}</span>
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 md:w-52">
            <Link
              to={`/item/${item?._id}`}
              className="rounded-2xl bg-zinc-900 px-4 py-2 text-center text-white transition hover:bg-zinc-800"
            >
              View Item
            </Link>

            {type === "made" && req.status === "pending" && (
              <button
                onClick={() => cancelMyRequestByItem(item?._id, req._id)}
                className="rounded-2xl bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600"
              >
                Cancel
              </button>
            )}

            {type === "received" && req.status === "pending" && (
              <>
                <button
                  onClick={() => updateRequestStatus(req._id, "accepted")}
                  className="rounded-2xl bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
                >
                  Accept
                </button>

                <button
                  onClick={() => updateRequestStatus(req._id, "rejected")}
                  className="rounded-2xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                >
                  Reject
                </button>
              </>
            )}

            {type === "received" && req.status === "accepted" && (
              <button
                onClick={() => updateRequestStatus(req._id, "completed")}
                className="rounded-2xl bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppShell>
      <PageHeader
        title="Requests"
        description={
          user
            ? `Track requests made by ${user.name} and requests received on your items.`
            : "Track item requests."
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

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => setActiveTab("made")}
          className={`rounded-2xl px-5 py-3 font-medium transition ${
            activeTab === "made"
              ? "bg-zinc-900 text-white"
              : "bg-white text-zinc-700 shadow-sm hover:bg-zinc-100"
          }`}
        >
          My Requests ({myRequests.length})
        </button>

        <button
          onClick={() => setActiveTab("received")}
          className={`rounded-2xl px-5 py-3 font-medium transition ${
            activeTab === "received"
              ? "bg-zinc-900 text-white"
              : "bg-white text-zinc-700 shadow-sm hover:bg-zinc-100"
          }`}
        >
          Received Requests ({receivedRequests.length})
        </button>
      </div>

      {loading ? (
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-zinc-500">Loading requests...</p>
        </div>
      ) : activeTab === "made" ? (
        myRequests.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-zinc-900">No requests made yet</h2>
            <p className="mt-3 text-zinc-600">
              Browse items and request something when you find what you need.
            </p>
            <Link
              to="/browse"
              className="mt-6 inline-block rounded-2xl bg-green-500 px-5 py-3 text-white transition hover:bg-green-600"
            >
              Browse Items
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6">
            {myRequests.map((req) => (
              <RequestCard key={req._id} req={req} type="made" />
            ))}
          </div>
        )
      ) : receivedRequests.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-zinc-900">No received requests yet</h2>
          <p className="mt-3 text-zinc-600">
            When other users request your items, they will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6">
          {receivedRequests.map((req) => (
            <RequestCard key={req._id} req={req} type="received" />
          ))}
        </div>
      )}
    </AppShell>
  );
}
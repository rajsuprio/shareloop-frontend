import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [requestStatus, setRequestStatus] = useState("none");
  const [showContactBox, setShowContactBox] = useState(false);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [borrowData, setBorrowData] = useState({
    days: "",
    note: "",
  });
  const [borrowSummary, setBorrowSummary] = useState(null);
  const [banner, setBanner] = useState({ type: "", message: "" });

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("shareloopItems")) || [];
    const foundItem = items.find((i) => String(i.id) === id);
    setItem(foundItem || null);

    const requests = JSON.parse(localStorage.getItem("shareloopRequests")) || {};
    if (requests[id]) {
      setRequestStatus(requests[id].status || "requested");
      if (requests[id].borrowDetails) {
        setBorrowSummary(requests[id].borrowDetails);
      }
    }
  }, [id]);

  function showMessage(type, message) {
    setBanner({ type, message });
    setTimeout(() => {
      setBanner({ type: "", message: "" });
    }, 2000);
  }

  function handleDelete() {
    const items = JSON.parse(localStorage.getItem("shareloopItems")) || [];
    const updatedItems = items.filter((i) => String(i.id) !== id);
    localStorage.setItem("shareloopItems", JSON.stringify(updatedItems));

    const savedItems =
      JSON.parse(localStorage.getItem("shareloopSavedItems")) || [];
    const updatedSavedItems = savedItems.filter((i) => String(i.id) !== id);
    localStorage.setItem("shareloopSavedItems", JSON.stringify(updatedSavedItems));

    const requests = JSON.parse(localStorage.getItem("shareloopRequests")) || {};
    delete requests[id];
    localStorage.setItem("shareloopRequests", JSON.stringify(requests));

    showMessage("success", "Item deleted successfully.");

    setTimeout(() => {
      navigate("/browse");
    }, 900);
  }

  function handleSimpleRequest() {
    const requests = JSON.parse(localStorage.getItem("shareloopRequests")) || {};
    requests[id] = { status: "requested" };
    localStorage.setItem("shareloopRequests", JSON.stringify(requests));
    setRequestStatus("requested");
    showMessage("success", "Request sent successfully.");
  }

  function handleCancelRequest() {
    const requests = JSON.parse(localStorage.getItem("shareloopRequests")) || {};
    delete requests[id];
    localStorage.setItem("shareloopRequests", JSON.stringify(requests));
    setRequestStatus("none");
    setBorrowSummary(null);
    setShowBorrowForm(false);
    showMessage("success", "Request cancelled.");
  }

  function calculateReturnDate(days) {
    const today = new Date();
    today.setDate(today.getDate() + Number(days));
    return today.toLocaleDateString();
  }

  function handleBorrowInputChange(e) {
    const { name, value } = e.target;
    setBorrowData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleBorrowSubmit(e) {
    e.preventDefault();

    if (!borrowData.days) {
      showMessage("error", "Please enter borrow duration.");
      return;
    }

    const details = {
      days: borrowData.days,
      note: borrowData.note,
      returnDate: calculateReturnDate(borrowData.days),
    };

    const requests = JSON.parse(localStorage.getItem("shareloopRequests")) || {};
    requests[id] = {
      status: "requested",
      borrowDetails: details,
    };

    localStorage.setItem("shareloopRequests", JSON.stringify(requests));
    setRequestStatus("requested");
    setBorrowSummary(details);
    setShowBorrowForm(false);

    showMessage("success", "Borrow request submitted successfully.");
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-10 sm:px-6 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Item not found</h1>
          <p className="mt-3 text-zinc-600">
            This item does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const actionLabel =
    item.type === "Donate"
      ? "Request Item"
      : item.type === "Borrow"
      ? "Request to Borrow"
      : "Contact Seller";

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 sm:px-6 sm:py-12">
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2 md:gap-10">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          {banner.message && (
            <div
              className={`mb-5 rounded-2xl p-4 text-sm font-medium ${
                banner.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {banner.message}
            </div>
          )}

          <p className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">
            {item.type}
          </p>

          <h1 className="mt-4 text-3xl font-bold text-zinc-900 sm:text-4xl">
            {item.title}
          </h1>

          <p className="mt-3 text-lg font-semibold text-zinc-900">
            {item.price}
          </p>

          <p className="mt-2 text-zinc-600">📍 {item.location}</p>
          <p className="mt-2 text-zinc-600">Category: {item.category}</p>

          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-900">
              About this item
            </h2>
            <p className="mt-3 text-zinc-600">
              This item was posted on ShareLoop for community donation, sale, or borrowing.
            </p>
          </div>

          <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-900">Action</h2>
            <p className="mt-2 text-zinc-600">
              Use the options below to connect with the item owner.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {item.type === "Borrow" ? (
                requestStatus === "none" ? (
                  <button
                    onClick={() => setShowBorrowForm((prev) => !prev)}
                    className="w-full rounded-2xl bg-green-500 px-5 py-3 font-medium text-white transition hover:bg-green-600"
                  >
                    {showBorrowForm ? "Hide Borrow Form" : actionLabel}
                  </button>
                ) : (
                  <button
                    onClick={handleCancelRequest}
                    className="w-full rounded-2xl bg-yellow-500 px-5 py-3 font-medium text-white transition hover:bg-yellow-600"
                  >
                    Cancel Request
                  </button>
                )
              ) : requestStatus === "none" ? (
                <button
                  onClick={handleSimpleRequest}
                  className="w-full rounded-2xl bg-green-500 px-5 py-3 font-medium text-white transition hover:bg-green-600"
                >
                  {actionLabel}
                </button>
              ) : (
                <button
                  onClick={handleCancelRequest}
                  className="w-full rounded-2xl bg-yellow-500 px-5 py-3 font-medium text-white transition hover:bg-yellow-600"
                >
                  Cancel Request
                </button>
              )}

              <button
                onClick={() => setShowContactBox((prev) => !prev)}
                className="w-full rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-800"
              >
                {showContactBox ? "Hide Contact Options" : "Contact Owner"}
              </button>
            </div>

            {item.type === "Borrow" && showBorrowForm && requestStatus === "none" && (
              <form
                onSubmit={handleBorrowSubmit}
                className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
              >
                <div className="grid gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Borrow Duration (days)
                    </label>
                    <input
                      type="number"
                      name="days"
                      value={borrowData.days}
                      onChange={handleBorrowInputChange}
                      placeholder="e.g. 7"
                      min="1"
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Note (optional)
                    </label>
                    <textarea
                      name="note"
                      value={borrowData.note}
                      onChange={handleBorrowInputChange}
                      placeholder="Add a short note for the owner..."
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                      rows="3"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-green-500 px-5 py-3 font-medium text-white transition hover:bg-green-600"
                  >
                    Submit Borrow Request
                  </button>
                </div>
              </form>
            )}

            {requestStatus === "requested" && (
              <div className="mt-4 rounded-2xl bg-green-50 p-4 text-green-700">
                <p>
                  Request status: <span className="font-semibold">Requested</span>
                </p>

                {borrowSummary && (
                  <div className="mt-3 text-sm text-green-800">
                    <p>
                      <span className="font-medium">Duration:</span> {borrowSummary.days} day(s)
                    </p>
                    <p>
                      <span className="font-medium">Expected return date:</span>{" "}
                      {borrowSummary.returnDate}
                    </p>
                    {borrowSummary.note ? (
                      <p>
                        <span className="font-medium">Note:</span> {borrowSummary.note}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            )}

            {showContactBox && (
              <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm text-zinc-600">
                  In the full version, this section can support in-app messaging,
                  phone contact, or email. For now, this is the contact/request UI placeholder.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button className="rounded-2xl bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
                    Send Message
                  </button>
                  <button className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-zinc-700 transition hover:bg-zinc-100">
                    View Owner Profile
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link to={`/post?edit=${item.id}`}>
              <button className="w-full rounded-2xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-600">
                Edit Item
              </button>
            </Link>

            <button
              onClick={handleDelete}
              className="w-full rounded-2xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600"
            >
              Delete This Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
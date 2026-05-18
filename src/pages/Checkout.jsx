import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function parsePriceValue(price) {
  if (!price) return 0;
  const parsed = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function Checkout() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [item, setItem] = useState(state?.item || null);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (item || !id) return;

    async function fetchItem() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/items/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unable to load item for checkout.");
        }

        setItem(data);
      } catch (error) {
        setBanner({ type: "error", message: error.message });
      }
    }

    fetchItem();
  }, [id, item]);

  const totalAmount = useMemo(() => parsePriceValue(item?.price), [item]);

  function showMessage(type, message) {
    setBanner({ type, message });
    setTimeout(() => setBanner({ type: "", message: "" }), 3000);
  }

  function handlePaymentChange(e) {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  }

  function validatePayment() {
    if (!token) {
      showMessage("error", "Please login before completing checkout.");
      return false;
    }

    if (!item) {
      showMessage("error", "No item selected for checkout.");
      return false;
    }

    if (item.type !== "Sell") {
      showMessage("error", "Checkout is only available for Sell items.");
      return false;
    }

    if (totalAmount <= 0) {
      showMessage("error", "This item does not have a valid sale price.");
      return false;
    }

    if (paymentMethod === "card") {
      if (!paymentData.cardName.trim()) {
        showMessage("error", "Cardholder name is required.");
        return false;
      }
      if (!/^\d{12,19}$/.test(paymentData.cardNumber.replace(/\s+/g, ""))) {
        showMessage("error", "Enter a valid card number.");
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(paymentData.expiry.trim())) {
        showMessage("error", "Expiry date must be in MM/YY format.");
        return false;
      }
      if (!/^\d{3,4}$/.test(paymentData.cvc.trim())) {
        showMessage("error", "Enter a valid CVC code.");
        return false;
      }
    }

    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validatePayment()) {
      return;
    }

    try {
      setSubmitting(true);
      showMessage("success", "Processing payment...");

      await new Promise((resolve) => setTimeout(resolve, 1200));

      showMessage(
        "success",
        "Payment completed successfully! You can now contact the seller to arrange delivery."
      );
      setTimeout(() => navigate(`/item/${id}`), 1400);
    } catch (error) {
      showMessage("error", "Payment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-10 sm:px-6 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {banner.message ? (
            <div
              className={`rounded-2xl p-4 text-sm font-medium ${
                banner.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {banner.message}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h1 className="text-3xl font-bold text-zinc-900">Loading checkout...</h1>
              <p className="mt-3 text-zinc-600">Fetching item details.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 sm:px-6 sm:py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Checkout
              </p>
              <h1 className="mt-3 text-3xl font-bold text-zinc-900">Secure Payment</h1>
              <p className="mt-2 text-zinc-600">
                Complete your purchase for the selected item and contact the seller once payment is done.
              </p>
            </div>
            <button
              onClick={() => navigate(`/item/${id}`)}
              className="inline-flex items-center rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
            >
              Back to item
            </button>
          </div>
        </div>

        {banner.message && (
          <div
            className={`rounded-2xl p-4 text-sm font-medium ${
              banner.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {banner.message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="h-24 w-24 rounded-3xl object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">{item.title}</h2>
                <p className="mt-1 text-sm text-zinc-500">{item.category}</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-sm text-zinc-600">Price</p>
                <p className="mt-2 text-3xl font-bold text-zinc-900">{item.price}</p>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-sm text-zinc-600">Seller</p>
                <p className="mt-2 text-base font-semibold text-zinc-900">
                  {item.user?.name || "Unknown"}
                </p>
                <p className="text-sm text-zinc-500">{item.user?.email || "No contact available"}</p>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-sm text-zinc-600">Delivery note</p>
                <p className="mt-2 text-sm text-zinc-600">
                  After payment, contact the seller in chat or by email to agree pickup or delivery.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-8 shadow-sm"
          >
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Payment method
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-blue-50"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    <p className="font-semibold text-zinc-900">Credit / Debit Card</p>
                    <p className="text-sm text-zinc-500">Fast and secure payment.</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      paymentMethod === "wallet"
                        ? "border-blue-500 bg-blue-50"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    <p className="font-semibold text-zinc-900">Mobile Wallet</p>
                    <p className="text-sm text-zinc-500">Use a trusted wallet app.</p>
                  </button>
                </div>
              </div>

              {paymentMethod === "card" ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Cardholder name
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentData.cardName}
                      onChange={handlePaymentChange}
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Full name on card"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Card number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">
                        Expiry date
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        value={paymentData.expiry}
                        onChange={handlePaymentChange}
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">
                        CVC
                      </label>
                      <input
                        type="text"
                        name="cvc"
                        value={paymentData.cvc}
                        onChange={handlePaymentChange}
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
                  <p className="text-sm font-medium text-zinc-900">Mobile Wallet instructions</p>
                  <p className="mt-2 text-sm text-zinc-600">
                    You will confirm payment through your mobile wallet app after submitting the order.
                  </p>
                </div>
              )}

              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-600">Order total</p>
                  <p className="text-lg font-semibold text-zinc-900">৳{totalAmount}</p>
                </div>
                <p className="mt-2 text-sm text-zinc-500">
                  Includes seller price and checkout fee. This is a simulated checkout experience.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Processing payment..." : `Pay ৳${totalAmount}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

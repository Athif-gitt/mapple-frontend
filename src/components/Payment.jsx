import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "@/api/axios";
import { loadRazorpay } from "@/utils/razorpay";
import { formatCurrency } from "../utils/currency";
import AddAddressModal from "./AddAddressModal";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const { type = "cart", productId } = location.state || {};

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // 🔹 Fetch addresses
  const loadAddresses = async () => {
    try {
      const res = await api.get("/adresses/");
      setAddresses(res.data);

      const def = res.data.find(a => a.is_default);
      if (def) setSelectedAddress(def);
    } catch {
      alert("Failed to load addresses");
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // 🔹 Create order when address selected
  useEffect(() => {
    if (!selectedAddress) return;

    const createOrder = async () => {
      try {
        setCreatingOrder(true);

        const url =
          type === "single"
            ? `/orders/create/?type=single&product_id=${productId}`
            : `/orders/create/?type=cart`;

        const res = await api.post(url, {
          address_id: selectedAddress.id,
        });

        setOrder(res.data);
      } catch (err) {
        alert(err.response?.data?.detail || "Unable to create order");
        navigate("/");
      } finally {
        setCreatingOrder(false);
      }
    };

    createOrder();
  }, [selectedAddress]);

  // 🔹 Razorpay
  const handlePayment = async () => {
    if (!order) return;

    setLoading(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay failed to load");
      setLoading(false);
      return;
    }

    const options = {
      key: order.key,
      amount: order.amount,
      currency: "INR",
      name: "Mapple Store",
      description: "Secure Checkout",
      order_id: order.order_id,

      handler: async (response) => {
  try {
    const res = await api.post("/orders/verify/", {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    });

    // ✅ redirect using DB order id
    navigate(`/orders/${res.data.order_id}`);
  } catch {
    alert("Payment verification failed");
  }
},


      theme: { color: "#6366f1" },
    };

    new window.Razorpay(options).open();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT — ADDRESS */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

          <div className="space-y-3">
            {addresses.map(addr => (
              <div
                key={addr.id}
                onClick={() => {
                  setSelectedAddress(addr);
                  setOrder(null);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  selectedAddress?.id === addr.id
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <p className="font-semibold">{addr.full_name}</p>
                <p className="text-sm text-slate-600">
                  {addr.line1}, {addr.city}, {addr.state} – {addr.pincode}
                </p>
                <p className="text-sm text-slate-600">{addr.phone}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowAddressModal(true)}
            className="mt-4 text-indigo-600 font-semibold hover:underline"
          >
            + Add new address
          </button>
        </div>

        {/* RIGHT — SUMMARY */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Total</span>
            <span className="font-bold">
              {order ? formatCurrency(order.amount / 100) : "—"}
            </span>
          </div>

          <button
            onClick={handlePayment}
            disabled={!order || loading || creatingOrder}
            className="mt-6 w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-400"
          >
            {creatingOrder
              ? "Preparing order..."
              : loading
              ? "Processing..."
              : "Pay Securely"}
          </button>

          <p className="text-xs text-slate-400 text-center mt-3">
            100% secure payments via Razorpay
          </p>
        </div>
      </div>

      {/* ➕ Add Address Modal */}
      {showAddressModal && (
        <AddAddressModal
          onClose={() => setShowAddressModal(false)}
          onSuccess={() => {
            setShowAddressModal(false);
            loadAddresses();
          }}
        />
      )}
    </div>
  );
}

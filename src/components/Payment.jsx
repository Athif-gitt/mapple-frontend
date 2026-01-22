import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "@/api/axios";
import { loadRazorpay } from "@/utils/razorpay";
import { formatCurrency } from "../utils/currency";

export default function Payment() {

  const navigate = useNavigate();
  const location = useLocation();

  const { type = "cart", productId } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  // 🔹 User details state
  const [details, setDetails] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  // 1️⃣ Create order on backend when page loads
  useEffect(() => {
    const createOrder = async () => {
      try {
        const url =
          type === "single"
            ? `/orders/create/?type=single&product_id=${productId}`
            : `/orders/create/`;

        const res = await api.post(url);
        setOrder(res.data);
      } catch (err) {
        alert("Unable to create order");
        navigate("/");
      }
    };

    createOrder();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  // 🔹 Validate details before payment
  const validateDetails = () => {
    const newErrors = {};

    if (!details.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!/^[6-9]\d{9}$/.test(details.phone))
      newErrors.phone = "Enter valid phone number";
    if (!details.address.trim()) newErrors.address = "Address is required";
    if (!details.city.trim()) newErrors.city = "City is required";
    if (!/^\d{6}$/.test(details.pincode))
      newErrors.pincode = "Invalid pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 2️⃣ Open Razorpay
  const handlePayment = async () => {
    if (!validateDetails()) return;

    setLoading(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      setLoading(false);
      return;
    }

    const options = {
      key: order.key,
      amount: order.amount,
      currency: "INR",
      name: "Mapple Store",
      description: "Secure Payment",
      order_id: order.order_id,

      prefill: {
        name: details.fullName,
        contact: details.phone,
      },

      handler: async function (response) {
        try {
          await api.post("/orders/verify/", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            address: details, // optional: store later
          });

          navigate("/order-success");
        } catch {
          alert("Payment verification failed");
        }
      },

      theme: { color: "#6366f1" },
    };

    new window.Razorpay(options).open();
    setLoading(false);
  };

  if (!order) {
    return <div className="p-10 text-center">Preparing payment…</div>;
  }
  //   console.log("Checkout type:", type);
  // console.log("Product ID:", productId);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Checkout Details
        </h1>

        {/* 🧾 User Details */}
        <div className="space-y-3">
          <input
            name="fullName"
            placeholder="Full Name"
            value={details.fullName}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />
          {errors.fullName && (
            <p className="text-xs text-red-500">{errors.fullName}</p>
          )}

          <input
            name="phone"
            placeholder="Phone Number"
            value={details.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone}</p>
          )}

          <input
            name="address"
            placeholder="Street Address"
            value={details.address}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />
          {errors.address && (
            <p className="text-xs text-red-500">{errors.address}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <input
              name="city"
              placeholder="City"
              value={details.city}
              onChange={handleChange}
              className="p-3 border rounded-xl"
            />
            <input
              name="pincode"
              placeholder="Pincode"
              value={details.pincode}
              onChange={handleChange}
              className="p-3 border rounded-xl"
            />
          </div>

          {(errors.city || errors.pincode) && (
            <p className="text-xs text-red-500">
              {errors.city || errors.pincode}
            </p>
          )}
        </div>

        {/* 💰 Order Summary */}
        <div className="flex justify-between text-slate-700 font-semibold">
          <span>Total Amount</span>
          <span className="text-indigo-600">
            {formatCurrency(order.amount / 100)}
          </span>
        </div>

        {/* 💳 Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:bg-slate-400 cursor-pointer"
        >
          {loading ? "Processing..." : "Pay Securely"}
        </button>

        <p className="text-xs text-slate-400 text-center">
          Payments are securely processed by Razorpay
        </p>
      </div>
    </div>
  );
}

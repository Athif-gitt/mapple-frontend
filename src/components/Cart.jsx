import { useState, useEffect } from "react";
import api from "@/api/axios";
import { formatCurrency } from "../utils/currency";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import AddAddressModal from "./AddAddressModal";

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const getCart = async () => {
    const token = localStorage.getItem("access-token");
    if (!token) return;

    const res = await api.get("/cart/");
    setCartItems(res.data.items || []);
  };

  const getAddresses = async () => {
    try {
      const res = await api.get("/adresses/");
      setAddresses(res.data);

      const defaultAddress = res.data.find(a => a.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (err) {
      console.error("Failed to load addresses", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    getCart();
    getAddresses();
  }, []);

  const updateQuantity = async (itemId, type) => {
    await api.patch(`/cart/item/${itemId}/`, { action: type });
    getCart();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/item/${itemId}/`);
    getCart();
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // 🚀 CHECKOUT FLOW WITH ADDRESS
  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    try {
      const res = await api.post("/orders/create/", {
        address_id: selectedAddress.id,
      });

      const { order_id, amount, key } = res.data;

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => openRazorpay(order_id, amount, key);
      document.body.appendChild(script);
    } catch (error) {
      console.error(error);
      alert("Could not create order");
    }
  };

  const openRazorpay = (order_id, amount, key) => {
    const options = {
      key,
      amount,
      currency: "INR",
      name: "Mapple Store",
      description: "Cart Payment",
      order_id,
      handler: async function (response) {
        try {
          await api.post("/orders/verify/", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Payment Successful!");
          getCart();
        } catch (error) {
          console.error(error);
          alert("Payment verification failed");
        }
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Nav />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Shopping Cart
        </h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* CART ITEMS */}
            <div className="flex-grow space-y-4">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
                >
                  <div className="w-24 h-24 bg-slate-50 rounded-xl flex items-center justify-center p-2 mr-6">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-grow text-center sm:text-left">
                    <h2 className="text-lg font-bold text-slate-800">
                      {item.product.name}
                    </h2>
                    <p className="text-indigo-600 font-bold mt-1">
                      {formatCurrency(item.product.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 mt-4 sm:mt-0">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, "dec")}
                        className="w-8 h-8 bg-white rounded-md shadow text-slate-600 hover:text-indigo-600 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-10 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, "inc")}
                        className="w-8 h-8 bg-white rounded-md shadow text-slate-600 hover:text-indigo-600 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="lg:w-96">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                <h2 className="text-xl font-bold mb-4">
                  Delivery Address
                </h2>

                {loadingAddresses ? (
                  <p className="text-sm text-slate-500">
                    Loading addresses...
                  </p>
                ) : addresses.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {addresses.map(address => (
                      <div
                        key={address.id}
                        onClick={() => setSelectedAddress(address)}
                        className={`p-3 rounded-xl border cursor-pointer transition
                          ${
                            selectedAddress?.id === address.id
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-slate-200 hover:border-slate-400"
                          }`}
                      >
                        <p className="font-semibold text-sm">
                          {address.full_name}
                        </p>
                        <p className="text-xs text-slate-600">
                          {address.line1}, {address.city},{" "}
                          {address.state} - {address.pincode}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No address added yet
                  </p>
                )}

                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-sm text-indigo-600 font-semibold hover:underline cursor-pointer mb-6"
                >
                  + Add new address
                </button>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 cursor-pointer"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl">
            <h2 className="text-xl font-bold mb-4">
              Your cart is empty
            </h2>
            <button
              onClick={() => navigate("/products")}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>

      {showAddressModal && (
        <AddAddressModal
          onClose={() => setShowAddressModal(false)}
          onSuccess={getAddresses}
        />
      )}
    </div>
  );
}

export default Cart;

import { useState, useEffect } from "react";
import api from "@/api/axios";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const getCart = async () => {
    const token = localStorage.getItem("access-token");
    if (!token) return;

    const res = await api.get("/cart/");
    setCartItems(res.data.items || []);
  };

  useEffect(() => {
    getCart();
  }, []);

  const updateQuantity = async (itemId, type) => {
    await api.patch(
      `/cart/item/${itemId}/`,
      { action: type }
    );
    getCart();
  };

  const removeItem = async (itemId) => {
    await api.delete(
      `/cart/item/${itemId}/`
    );
    getCart();
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // 🚀 RAZORPAY CHECKOUT FLOW
  const handleCheckout = async () => {
    try {
      // Step 1 — Create order on backend
      const res = await api.post(
        "/orders/create/",
        {}
      );

      const { order_id, amount, key } = res.data;

      // Step 2 — Load Razorpay script & open popup
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
          await api.post(
            "/orders/verify/",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          alert("Payment Successful!");
          getCart(); // refresh cart items
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
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Shopping Cart</h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="flex-grow space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                  <div className="w-24 h-24 bg-slate-50 rounded-xl flex items-center justify-center p-2 mb-4 sm:mb-0 mr-0 sm:mr-6 flex-shrink-0">
                    <img src={item.product.image} className="w-full h-full object-contain" alt={item.product.name} />
                  </div>

                  <div className="flex-grow text-center sm:text-left">
                    <h2 className="text-lg font-bold text-slate-800">{item.product.name}</h2>
                    <p className="text-indigo-600 font-bold mt-1">${item.product.price}</p>
                  </div>

                  <div className="flex items-center gap-6 mt-4 sm:mt-0">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, "dec")}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-indigo-600 font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-medium text-slate-700">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, "inc")}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-indigo-600 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2"
                      title="Remove Item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-96 flex-shrink-0">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>${total}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="h-px bg-slate-100 my-2"></div>
                  <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  <span>Checkout</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-6">Looks like you haven't added anything yet.</p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

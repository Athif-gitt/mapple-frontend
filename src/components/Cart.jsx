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
    <div className="p-0 bg-gray-50 min-h-screen">
      <Nav />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h1>

      {cartItems.length > 0 ? (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow-md">
              <img src={item.product.image} className="h-20 w-20 mr-4" />
              <div className="flex-1">
                <h2>{item.product.name}</h2>
                <p>${item.product.price}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <button onClick={() => updateQuantity(item.id, "dec")}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, "inc")}>+</button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <h2 className="text-2xl font-bold mt-4 text-gray-800">Total: ${total}</h2>

          {/* 💳 BUY ALL BUTTON */}
          <button
            onClick={handleCheckout}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Buy All & Pay 💳
          </button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;

import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const getCart = async () => {
    const token = localStorage.getItem("access-token");
    if (!token) return;

    const res = await axios.get("http://127.0.0.1:8000/api/cart/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCartItems(res.data.items || []);
  };

  useEffect(() => {
    getCart();
  }, []);

  const updateQuantity = async (itemId, type) => {
    const token = localStorage.getItem("access-token");
    await axios.patch(
      `http://127.0.0.1:8000/api/cart/item/${itemId}/`,
      { action: type },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    getCart();
  };

  const removeItem = async (itemId) => {
    const token = localStorage.getItem("access-token");
    await axios.delete(
      `http://127.0.0.1:8000/api/cart/item/${itemId}/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    getCart();
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
              <button onClick={() => removeItem(item.id)} className="bg-red-600 text-white px-3 py-1 rounded">
                Remove
              </button>
            </div>
          ))}

          <h2 className="text-2xl font-bold mt-4 text-gray-800">Total: ${total}</h2>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;

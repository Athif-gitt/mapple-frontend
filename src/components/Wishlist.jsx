import { useState, useEffect } from "react";
import api from "@/api/axios";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const getWishlist = async () => {
    const token = localStorage.getItem("access-token");
    if (!token) return;

    const res = await api.get("/wishlist/");
    setItems(res.data || []);
  };

  useEffect(() => {
    getWishlist();
  }, []);

  const removeItem = async (itemId) => {
    await api.delete(
      `/wishlist/item/${itemId}/`
    );
    getWishlist();
  };

  return (
    <div className="p-0 bg-gray-50 min-h-screen">
      <Nav />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Wishlist</h1>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white p-4 rounded-lg shadow-md"
            >
              <img
                src={item.product.image}
                className="h-20 w-20 object-contain mr-4"
              />

              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                <p className="text-gray-600">${item.product.price}</p>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 ml-4">Your wishlist is empty.</p>
      )}
    </div>
  );
}

export default Wishlist;

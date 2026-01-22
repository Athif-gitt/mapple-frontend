import { useState, useEffect } from "react";
import api from "@/api/axios";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getWishlist = async () => {
    try {
      const res = await api.get("/wishlist/");
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWishlist();
  }, []);

  const removeItem = async (itemId) => {
    await api.delete(`/wishlist/item/${itemId}/`);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Nav />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Your Wishlist
          </h1>
          <button
            onClick={() => navigate("/products")}
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            Continue Shopping →
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-slate-500">Loading wishlist...</p>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-6">🤍</div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-slate-500 mb-6">
              Save items you love and come back to them anytime.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Browse Products
            </button>
          </div>
        )}

        {/* Wishlist Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden group"
              >
                {/* Image */}
                <div className="h-56 bg-slate-100 flex items-center justify-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-40 object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-2">
                    {item.product.name}
                  </h2>

                  <p className="text-slate-600 mb-4">
                    ${item.product.price}
                  </p>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        navigate(`/products/${item.product.id}`)
                      }
                      className="text-indigo-600 font-semibold hover:text-indigo-700 hover:cursor-pointer"
                    >
                      View Product
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600 font-medium hover: cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;

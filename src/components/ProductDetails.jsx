import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "@/api/axios";
import { formatCurrency } from "../utils/currency";
import Nav from "./Nav";

export default function ProductDetails() {
  const { id } = useParams(); // URL ID
  const location = useLocation(); // navigation state
  const navigate = useNavigate();

  const [product, setProduct] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);

  useEffect(() => {
    // If product was NOT passed via state, fetch using ID
    if (!product && id) {
      api
        .get(`/products/${id}/`)
        .then((res) => setProduct(res.data))
        .finally(() => setLoading(false));
    }
  }, [id, product]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!product) return <p className="p-10">Product not found</p>;

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access-token");

    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    try {
      await api.post("/cart/", {
        product_id: product.id,
      });

      navigate("/cart");
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Failed to add item to cart");
    }
  };

  const handleBuyNow = () => {
    navigate("/payment", {
      state: {
        type: "single",
        productId: product.id,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Nav />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="p-12 bg-slate-50 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-md object-contain hover:scale-105 transition"
              />
            </div>

            {/* Content */}
            <div className="p-12 flex flex-col">
              <span className="inline-block mb-4 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                In Stock
              </span>

              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-indigo-600 mb-6">
                {formatCurrency(product.price)}
              </p>

              <p className="text-slate-500 mb-10">{product.description}</p>

              <div className="flex gap-4 mt-auto">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 cursor-pointer"
                >
                  Buy Now
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-slate-200 py-4 rounded-xl font-bold hover:border-indigo-600 cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "./Nav";

export default function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state || {
    name: "Sample Product",
    price: 199.99,
    description: "This is a minimal product detail page.",
    image: "https://via.placeholder.com/400",
    id: 1,
  };

  const handleAddToCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    const cart = user.cart || [];
    const existing = cart.find((i) => i.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("user", JSON.stringify({ ...user, cart }));
    alert("Added to cart!");
    navigate("/cart");
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

            {/* Image Section */}
            <div className="p-8 md:p-12 bg-slate-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-md object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-indigo-600 uppercase bg-indigo-50 rounded-full">
                  In Stock
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{product.name}</h1>
                <p className="text-3xl font-bold text-indigo-600 mb-6">${product.price}</p>
                <div className="prose prose-slate text-slate-500 leading-relaxed mb-8">
                  {product.description}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-xl transition-all h-14"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-8 py-4 bg-white text-slate-800 border-2 border-slate-200 rounded-xl font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all h-14"
                >
                  Add to Cart
                </button>
              </div>

              <div className="mt-8 flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                  <span>Authentic</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <span>Free Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remove global footer from here if it's double, if it's not global in App.jsx yet. 
         Wait, I removed it from Home.jsx because Home.jsx had it hardcoded. 
         ProductDetails.jsx does NOT have Footer. 
         Wait, App.jsx puts Footer at bottom. 
         So I don't need to add <Footer /> here. 
      */}
    </div>
  );
}

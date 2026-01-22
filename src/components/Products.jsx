import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { formatCurrency } from "../utils/currency";
import Nav from "./Nav";

function Products({ categoryProp }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = categoryProp || params.get("category");
  const [search, setSearch] = useState("");

  const fetchWishlistIds = async () => {
    try {
      const res = await api.get("/wishlist/");
      return res.data.map((item) => item.product.id);
    } catch {
      return [];
    }
  };


  const fetchProducts = async (page = 1) => {
    let url = `/products/?page=${page}`;
    if (category) url += `&category=${category}`;
    if (search) url += `&search=${search}`;

    const [productsRes, wishlistIds] = await Promise.all([
      api.get(url),
      fetchWishlistIds(),
    ]);

    const productsWithWishlist = productsRes.data.results.map((p) => ({
      ...p,
      wishlisted: wishlistIds.includes(p.id),
    }));

    setProducts(productsWithWishlist);
    setCurrentPage(page);
    setTotalPages(Math.ceil(productsRes.data.count / 1));
  };


  useEffect(() => {
    fetchProducts(1);
  }, [category, search]);

  const handleCardClick = (item) => {
    navigate(`/products/${item.id}`, { state: item });
  };

  const handleAddToCart = async (item) => {
    await api.post(
      "/cart/",
      { product_id: item.id }
    );
    navigate("/cart");
  };

  const pageNumbers = [...Array(totalPages).keys()].map((n) => n + 1);

  const handleToggleWishlist = async (item) => {
    const token = localStorage.getItem("access-token");

    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    try {
      if (item.wishlisted) {
        // remove from wishlist
        await api.delete(`/wishlist/item/${item.id}/`);
      } else {
        // add to wishlist
        await api.post("/wishlist/", { product_id: item.id });
      }

      // 🔴 THIS IS WHAT MAKES THE HEART TOGGLE
      setProducts((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? { ...p, wishlisted: !p.wishlisted }
            : p
        )
      );
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
    }
  };



  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Nav />

      {/* Header & Filters */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : "All Products"}
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 absolute left-4 top-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            <button
              onClick={() => navigate("/products")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${!category ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
            >
              All
            </button>
            {["iphone", "macbook", "airpods"].map((c) => (
              <button
                key={c}
                onClick={() => navigate(`/products?category=${c}`)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${category === c ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col cursor-pointer relative"
              >
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleWishlist(item);
                  }}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-full shadow-sm backdrop-blur-sm transition-all transform hover:scale-110 cursor-pointer
    ${item.wishlisted
                      ? "bg-red-50 text-red-500"
                      : "bg-white/80 text-slate-400 hover:text-red-500"
                    }
  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={item.wishlisted ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </button>


                {/* Image Container */}
                <div className="relative overflow-hidden aspect-[4/3] bg-slate-50 flex items-center justify-center p-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">{item.name}</h3>
                    <span className="font-bold text-indigo-600 text-lg">{formatCurrency(item.price)}</span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">{item.description}</p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    className="mt-auto w-full py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200 hover:shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="inline-block p-4 rounded-full bg-slate-100 mb-4 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-500">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            <button
              disabled={currentPage === 1}
              onClick={() => fetchProducts(currentPage - 1)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors text-sm font-medium cursor-pointer"
            >
              Previous
            </button>

            {pageNumbers.map((num) => (
              <button
                key={num}
                onClick={() => fetchProducts(num)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center cursor-pointer ${num === currentPage
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                {num}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => fetchProducts(currentPage + 1)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors text-sm font-medium cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;

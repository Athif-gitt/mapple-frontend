import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "./Nav";

function Products() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const [search, setSearch] = useState("");

  const fetchProducts = async (page = 1) => {
    const token = localStorage.getItem("access-token");
    if (!token) return;

    let url = `/products/?page=${page}`;

    if (category) url += `&category=${category}`;
    if (search) url += `&search=${search}`;

    const res = await api.get(url);

    setProducts(res.data.results);
    setCurrentPage(page);
    setTotalPages(Math.ceil(res.data.count / 1)); // 1 is PAGE_SIZE
  };

  useEffect(() => {
    fetchProducts(1);
  }, [category, search]);

  const handleCardClick = (item) => {
    navigate("/product-details", { state: item });
  };

  const handleAddToCart = async (item) => {
    await api.post(
      "/cart/",
      { product_id: item.id }
    );
    navigate("/cart");
  };

  const pageNumbers = [...Array(totalPages).keys()].map((n) => n + 1);

  const handleAddToWishlist = async (item) => {
    await api.post(
      "/wishlist/",
      { product_id: item.id }
    );
    alert("Added to Wishlst 👍");
  };

  return (
    <div className="p-0 bg-gray-50 min-h-screen">
      <Nav />

      {/* Search */}
      <div className="flex justify-center mt-4 px-6">
        <input
          type="text"
          placeholder="Search products..."
          className="border border-gray-300 px-4 py-2 rounded-lg w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="flex justify-center gap-3 mt-6 px-6">
        {["iphone", "macbook", "airpods"].map((c) => (
          <button
            key={c}
            onClick={() => navigate(`/products?category=${c}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-gray-800 my-5">
        {category ? `${category.toUpperCase()} Products` : "All Products"}
      </h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
        {products.length > 0 ? (
          products.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 cursor-pointer"
            >
              {/* Wishlist heart icon */}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist(item);
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl transition cursor-pointer"
              >
                ❤️
              </span>

              <img
                src={item.image}
                className="h-40 w-full object-contain mb-3"
              />
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-500 text-sm">{item.description}</p>
              <p className="text-blue-600 font-bold mt-2">${item.price}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products found.
          </p>
        )}
      </div>

      {/* PAGINATION UI */}
      <div className="flex justify-center items-center gap-2 mt-8 pb-10">
        <button
          disabled={currentPage === 1}
          onClick={() => fetchProducts(currentPage - 1)}
          className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => fetchProducts(num)}
            className={`px-3 py-2 rounded ${num === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {num}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => fetchProducts(currentPage + 1)}
          className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Products;

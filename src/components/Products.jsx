import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "./Nav";

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");

  useEffect(() => {
  const url = category
    ? `http://127.0.0.1:8000/api/products/?category=${category}`
    : `http://127.0.0.1:8000/api/products/`;

  axios
    .get(url)
    .then((res) => setProducts(res.data))
    .catch((err) => console.error(err));
}, [category]);

  const handleCardClick = (item) => {
    navigate("/product-details", { state: item });
  };

  const handleAddToCart = async (item) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first!");
      return;
    }

    const cart = user.cart || [];
    const existingItem = cart.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    try {
      const res = await axios.patch(`http://localhost:3010/users/${user.id}`, { cart });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/cart");
    } catch (err) {
      console.error("Error updating cart:", err);
      alert("Failed to add to cart. Try again.");
    }
  };

  return (
    <div className="p-0 bg-gray-50 min-h-screen">
      <Nav />

      <div className="flex justify-center gap-3 mt-3 px-6">
        <button
  onClick={() => navigate("/products?category=iphone")}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
>
  iPhone
</button>

<button
  onClick={() => navigate("/products?category=macbook")}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
>
  MacBook
</button>

<button
  onClick={() => navigate("/products?category=airpods")}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
>
  AirPods
</button>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-800 my-5">
        All Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
        {products.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-40 w-full object-contain mb-3"
            />
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-gray-500 text-sm">{item.description}</p>
            <p className="text-blue-600 font-bold mt-2">${item.price}</p>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                handleAddToCart(item);
              }}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;

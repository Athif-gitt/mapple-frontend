import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import Nav from "../Nav";

function MacBook() {
  const [macBook, setMacBook] = useState([]);

  useEffect(() => {
    api
      .get("/products/?category=MacBook")
      .then((res) => setMacBook(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <div>
      <Nav />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 mt-6">
        {macBook.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-40 w-full object-contain mb-3"
            />
            <h3 className="text-lg font-semibold text-gray-800">
              {item.name}
            </h3>
            <p className="text-gray-500 text-sm">{item.description}</p>
            <p className="text-blue-600 font-bold mt-2">${item.price}</p>
            <button
              onClick={() => handleAddToCart(item)}
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

export default MacBook

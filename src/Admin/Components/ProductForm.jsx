import React, { useState } from "react";
import api from "@/api/axios";

function ProductForm({ setProducts }) {
  const [form, setForm] = useState({ name: "", price: "", category: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/products/admin/", form)
      .then((res) => {
        setProducts((prev) => [...prev, res.data]);
        setForm({ name: "", price: "", category: "" });
      })
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-4">
      <input
        type="text"
        placeholder="Product Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 rounded w-full"
      />
      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="border p-2 rounded w-full"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add Product
      </button>
    </form>
  );
}

export default ProductForm;

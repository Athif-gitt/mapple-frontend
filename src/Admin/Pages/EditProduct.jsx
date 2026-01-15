import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("access-token");
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/products/admin/${id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load product", err);
        navigate("/admin-home/products");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access-token");

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/products/admin/${id}/`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Product updated successfully!");
      navigate("/admin-home/products");
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed — check the fields & try again!");
    }
  };

  if (loading) return <p className="p-6">Loading product...</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows="4"
          required
        />

        <input
          type="url"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProduct;

import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { useParams, useNavigate } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(
          `/products/admin/${id}/`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to load product:", error);
        navigate("/admin-home/products");
      }
    };

    fetchItem();
  }, [id]);

  if (!product) return <p className="p-6">Loading product...</p>;

  return (
    <div className="p-6 bg-white rounded shadow space-y-3 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold">Product Details</h2>

      <p><strong>Name:</strong> {product.name}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Price:</strong> ₹{product.price}</p>
      <p><strong>Description:</strong> {product.description}</p>

      <img src={product.image} alt={product.name} className="w-48 rounded shadow" />

      <button
        onClick={() => navigate(`/admin-home/products/${id}/edit`)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Edit
      </button>
    </div>
  );
}

export default ProductDetails;

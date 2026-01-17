import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(
          "/products/admin/"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(
        `/products/admin/${id}/`
      );

      setProducts(products.filter((p) => p.id !== id));
      alert("Product deleted!");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };


  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Products</h2>
        <button
          onClick={() => navigate("/admin-home/new")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add product ➕
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-2">{product.name}</td>
              <td className="p-2 capitalize">{product.category}</td>
              <td className="p-2">₹{product.price}</td>
              <td className="p-2">{product.stock ?? "—"}</td>
              <td className="p-2 text-right space-x-3">
                <button className="text-blue-600 hover:underline"
                  onClick={() => navigate(`/admin-home/products/${product.id}`)}>
                  View</button>

                {/* <button className="text-green-600 hover:underline">Edit</button> */}

                <button className="text-red-600 hover:underline"
                  onClick={() => deleteProduct(product.id)}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <p className="text-gray-500 mt-4">No products found.</p>
      )}
    </div>
  );
}

export default AdminProducts;

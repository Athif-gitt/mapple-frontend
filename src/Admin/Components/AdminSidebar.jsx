import React from "react";
import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="w-64 bg-white shadow-md h-screen p-5">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/admin-home/stats" className="hover:text-blue-600">Analytics</Link>
        </li>
        <li>
          <Link to="/admin-home/products" className="hover:text-blue-600">Products</Link>
        </li>
        <li>
          <Link to="/admin-home/users" className="hover:text-blue-600">Users</Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminSidebar;

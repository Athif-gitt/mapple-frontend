import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminSidebar from "../Components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import AdminProducts from "./AdminProducts";
import AdminUsers from "./AdminUsers";
import UserDetails from "./UserDetails";
import NewProduct from "./NewProduct";

function AdminHome() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <div className="p-6">
          <Routes>
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="new" element={<NewProduct />} />
            <Route
              path="admin-home"
              element={
                <h2 className="text-xl font-semibold">Welcome Admin, beeen waiting for you!!!</h2> // self coded
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;

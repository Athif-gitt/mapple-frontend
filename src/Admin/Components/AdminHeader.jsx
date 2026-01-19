import React from "react";
import { useNavigate } from "react-router-dom";

function AdminHeader() {
  const navigate = useNavigate()
  const handleLogOut = () => {
    localStorage.clear();
    navigate('/login')
  }
  return (
    <div className="admin-header shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <button onClick={handleLogOut} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
        Logout
      </button>
    </div>
  );
}

export default AdminHeader;

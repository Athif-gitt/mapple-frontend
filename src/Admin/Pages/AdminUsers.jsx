import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api/axios";
import AdminSidebar from "../Components/AdminSidebar";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/admin/users/");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      {/* <AdminSidebar /> */}
      <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>
      <ul className="space-y-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-white shadow p-3 rounded flex justify-between"
          >
            <span>
              {user.username} ({user.email})
            </span>
            <Link
              to={`/admin-home/users/${user.id}`}
              className="text-blue-600 hover:underline"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUsers;

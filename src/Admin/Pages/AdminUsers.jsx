import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../Components/AdminSidebar";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("access-token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/auth/admin/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

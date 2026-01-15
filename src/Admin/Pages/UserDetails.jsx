import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access-token");
      if (!token) return;

      try {
        const res = await axios.get(`http://localhost:8000/api/auth/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white shadow rounded space-y-3">
      <h2 className="text-2xl font-semibold">User Details</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Is Staff:</strong> {user.is_staff ? "Yes" : "No"}</p>
      <p><strong>Active:</strong> {user.is_active ? "Yes" : "No"}</p>
    </div>
  );
}

export default UserDetails;

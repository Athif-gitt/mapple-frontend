import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/axios";
import { toggleUserBlock } from "../../api/adminUsers";

function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/auth/admin/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  const handleToggleBlock = async () => {
  try {
    const res = await toggleUserBlock(user.id);

    // Update UI instantly
    setUser((prev) => ({
      ...prev,
      is_active: res.data.is_active,
    }));
  } catch (err) {
    console.error(err);
    alert("Failed to update user status");
  }
};

  return (
    <div className="p-6 bg-white shadow rounded space-y-3">
      <h2 className="text-2xl font-semibold">User Details</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Is Staff:</strong> {user.is_staff ? "Yes" : "No"}</p>
      <p><strong>Active:</strong> {user.is_active ? "Yes" : "No"}</p>

      <button
  onClick={handleToggleBlock}
  className={`mt-4 px-4 py-2 rounded text-white ${
    user.is_active ? "bg-red-600" : "bg-green-600"
  }`}
>
  {user.is_active ? "Block User" : "Unblock User"}
</button>
    </div>
  );
}

export default UserDetails;

import api from "@/api/axios";

export const toggleUserBlock = (userId) => {
  return api.patch(`/auth/admin/users/${userId}/block/`);
};
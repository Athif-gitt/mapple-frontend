import api from "@/api/axios";

export const fetchProfileDashboard = () => {
  return api.get("/auth/profile/dashboard/");
};

import api from "@/api/axios";

export const getNotifications = () =>
  api.get("/notifications/");

export const markNotificationRead = (id) =>
  api.patch(`/notifications/${id}/read/`);

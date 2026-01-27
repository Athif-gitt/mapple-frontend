import api from "./axios";

export const getReviews = (productId) =>
  api.get(`/reviews/products/${productId}/reviews/`);

export const addReview = (productId, data) =>
  api.post(`/reviews/products/${productId}/reviews/add/`, data);

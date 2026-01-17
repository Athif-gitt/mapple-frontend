import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear local storage and redirect to login if unauthorized
            localStorage.removeItem('access-token');
            localStorage.removeItem('refresh-token'); // Assuming refresh-token might also exist
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

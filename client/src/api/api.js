import axios from 'axios';
import useAuthStore from '../store/authStore';

export const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

// This will check for 401 errors and automatically log the user out
api.interceptors.response.use(
    (response) => response, // Do nothing on successful responses
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token is invalid or expired
            useAuthStore.getState().logout();
            // Optionally redirect to login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
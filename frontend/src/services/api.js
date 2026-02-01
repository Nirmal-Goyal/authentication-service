import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (name, email, password, age) =>
        api.post('/auth/register', { name, email, password, age }),

    login: (email, password) =>
        api.post('/auth/login', { email, password }),

    getProfile: () =>
        api.get('/auth/profile'),
};

export const dashboardAPI = {
    getStats: () =>
        api.get('/dashboard/stats'),

    getUptime: () =>
        api.get('/dashboard/uptime'),
};

export default api;

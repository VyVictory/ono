import axios from 'axios';
import connectENV from './connectENV';
import authToken from './storage/authToken';

// Tạo một instance của Axios với base URL
const api = axios.create({
    baseURL: connectENV.api,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để tự động gắn token vào header
api.interceptors.request.use((config) => {
    const token = authToken.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;

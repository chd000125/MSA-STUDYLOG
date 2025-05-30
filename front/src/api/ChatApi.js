// src/api.jsx
import axios from 'axios';

export const BASE_URL = 'http://localhost:8123';
export const WS_URL = `${BASE_URL}/ws`;

const api = axios.create({
    baseURL: 'http://localhost:9090',
    withCredentials: true, // 필요 시 추가 (ex: 인증 쿠키)
});

export default api;
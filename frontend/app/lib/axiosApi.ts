import axios from 'axios';
export const axiosApi = axios.create({
    baseURL:'http://localhost:3001',
    headers: {
        "Content-Type":"application/json",
        
    }
})

axiosApi.interceptors.request.use( (config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
})
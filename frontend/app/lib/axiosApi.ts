import axios from 'axios';
export const axiosApi = axios.create({
    baseURL:process.env.NEXT_PUBLIC_BACKEND_URL,
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
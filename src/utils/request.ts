
import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_DOMAIN_PREFIX;
const request = axios.create({
    baseURL: baseUrl,
    timeout: 1000,
});

export { request }
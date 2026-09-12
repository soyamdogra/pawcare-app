import axios from 'axios';

// Automatically switches between your Render backend and local development
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

export default API;
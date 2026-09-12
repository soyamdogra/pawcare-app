import axios from 'axios';

// Automatically uses your Render URL in production and localhost during development
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://luhid.onrender.com/api' // Replace with your exact Render backend URL if different
  : 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default API;
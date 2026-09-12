import axios from 'axios';

// Automatically uses your Render URL in production and localhost during development
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://luhid.onrender.com/api' 
  : 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default API;
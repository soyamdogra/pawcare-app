import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const api = axios.create({
  baseURL: isLocal 
    ? 'http://localhost:5000' 
    : 'https://luhid-a3f4ayh6fdbjgzdn.eastasia-01.azurewebsites.net',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
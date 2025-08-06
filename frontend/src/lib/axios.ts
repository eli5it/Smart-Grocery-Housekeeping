import axios from 'axios';

// Configure axios with the API base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://192.168.50.179:8001',
  withCredentials: true,
});

export default apiClient;

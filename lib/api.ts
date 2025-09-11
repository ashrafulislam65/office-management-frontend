// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:9001';

// export const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true, // This is essential for cookies
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add request interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     console.log('Making request to:', config.url);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor
// apiClient.interceptors.response.use(
//   (response) => {
//     console.log('Response received:', response.status);
//     return response;
//   },
//   (error) => {
//     console.error('API Error:', error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );  

// utils/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9001/admin/users';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to handle session
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
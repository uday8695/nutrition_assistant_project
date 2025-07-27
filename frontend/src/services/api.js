// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:5000/api',
// });

// // Attach token if present
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem('token');
//   if (token) req.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODIzNzAwMWZjZGNiMzRmY2Q4ZjM2YSIsImlhdCI6MTc1MzM2ODQxMiwiZXhwIjoxNzUzOTczMjEyfQ.gIaZCqiz0r63E14PKxzTIlxyCYGAb-WaX3NSULGxndI
// `;
//   return req;
// });

// export default API;


import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token} `;
  }
  return config;
});

export default API;

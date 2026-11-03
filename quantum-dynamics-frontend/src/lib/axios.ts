import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('qd_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If receiving 401 Unauthorized while on a protected page, clear stale tokens and send to login
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const isAuthPage = pathname.startsWith('/login') || 
                         pathname.startsWith('/register') || 
                         pathname.startsWith('/forgot-password') || 
                         pathname.startsWith('/reset-password');
      if (!isAuthPage) {
        document.cookie = 'qd_access_token=; path=/; max-age=0;';
        localStorage.removeItem('qd_access_token');
        localStorage.removeItem('qd_user');
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

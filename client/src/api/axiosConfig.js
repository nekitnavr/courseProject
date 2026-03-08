import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('unauthenticated'));
    }else if (error.response?.status === 403) {
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
)

export default axiosInstance;
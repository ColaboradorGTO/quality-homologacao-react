import axios from 'axios';

const BASE_URL = "https://api-node-homologacao.vercel.app/";
// const BASE_URL = "http://localhost:6004";

const axiosInstance = axios.create({
  timeout: 80000,
  baseURL: BASE_URL,
  // baseURL: import.meta.env.VITE_BASE_URL,
});

export default axiosInstance;

// src/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// During development: point to your laptop backend
// NOTE: on a real phone use your machine IP (e.g. http://192.168.1.10:5000)
// or use ngrok and replace API_URL with the ngrok URL.
// For Codespaces, use forwarded port URL.
export const API_URL = "http://10.0.2.2:5000/api"; // Android emulator default
// If testing on real device, set API_URL to http://<YOUR_LAPTOP_IP>:5000/api

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  config.headers["Accept"] = "application/json";
  return config;
}, (error) => Promise.reject(error));

export const register = (payload) => api.post("/auth/register", payload);
export const login = (payload) => api.post("/auth/login", payload);
export const fetchPosts = () => api.get("/posts");
export const createPost = (formData, config = {}) => api.post("/posts", formData, config);

export default api;
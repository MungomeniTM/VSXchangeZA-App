// src/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const NGROK_FILE = `${FileSystem.documentDirectory}ngrok_url.txt`;

// default fallback (Android emulator). For iOS simulator use http://localhost:5000/api
const FALLBACK_LOCAL = "http://10.0.2.2:5000/api"; 

export async function setAPIBaseURL(url) {
  // pass the full base url including /api, example: "https://xxxx.ngrok-free.app/api"
  try {
    await FileSystem.writeAsStringAsync(NGROK_FILE, url);
    console.log("✅ saved API base URL:", url);
  } catch (e) {
    console.warn("Failed to save API url:", e.message || e);
  }
}

export async function getAPIBaseURL() {
  try {
    const cached = await FileSystem.readAsStringAsync(NGROK_FILE);
    if (cached && cached.trim()) return cached.trim();
  } catch (e) {
    // ignore
  }
  return FALLBACK_LOCAL;
}

export async function createAPI() {
  const baseURL = await getAPIBaseURL();
  const instance = axios.create({
    baseURL,
    timeout: 15000,
  });

  instance.interceptors.request.use(async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      config.headers.Accept = "application/json";
    } catch (e) {
      /* ignore */
    }
    return config;
  });

  return instance;
}

// convenience helpers
export async function register(payload) {
  const api = await createAPI();
  return api.post("/auth/register", payload);
}
export async function login(payload) {
  const api = await createAPI();
  return api.post("/auth/login", payload);
}
export async function fetchPosts() {
  const api = await createAPI();
  return api.get("/posts");
}
export async function approvePost(postId) {
  const api = await createAPI();
  return api.post(`/posts/${postId}/approve`);
}
export default createAPI;
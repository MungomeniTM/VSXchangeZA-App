// src/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const NGROK_FILE_PATH = `${FileSystem.documentDirectory}ngrok_url.txt`;

// Try to load your latest ngrok link (so you don’t manually paste it)
export async function getAPIBaseURL() {
  try {
    const savedURL = await FileSystem.readAsStringAsync(NGROK_FILE_PATH);
    if (savedURL) return savedURL.trim();
  } catch (e) {
    console.log("⚠️ No cached Ngrok URL found");
  }
  // fallback (change to your local IP if needed)
  return "http://10.0.2.2:5000/api";
}

// Save new ngrok URL manually once, then it stays cached
export async function setAPIBaseURL(url) {
  await FileSystem.writeAsStringAsync(NGROK_FILE_PATH, url);
  console.log("✅ Ngrok URL updated:", url);
}

export async function createAPI() {
  const baseURL = await getAPIBaseURL();
  console.log("🔗 Using API base URL:", baseURL);

  const api = axios.create({ baseURL, timeout: 10000 });

  api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return api;
}
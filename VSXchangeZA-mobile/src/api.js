// src/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import * as Network from "expo-network";

const NGROK_FILE = `${FileSystem.documentDirectory}ngrok_url.txt`;

// default local fallback (for emulator use)
const FALLBACK_LOCAL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5000/api"
    : "http://localhost:5000/api";

/**
 * ✅ Save ngrok or remote URL persistently
 */
export async function setAPIBaseURL(url) {
  try {
    await FileSystem.writeAsStringAsync(NGROK_FILE, url.trim());
    console.log("✅ Saved API base URL:", url);
  } catch (err) {
    console.warn("⚠️ Failed to save API URL:", err.message || err);
  }
}

/**
 * ✅ Read saved ngrok URL, or fall back to local IP
 */
export async function getAPIBaseURL() {
  try {
    // 1️⃣ If user manually saved an ngrok URL, use that
    const cached = await FileSystem.readAsStringAsync(NGROK_FILE);
    if (cached && cached.trim().startsWith("http")) {
      console.log("🌐 Using cached Ngrok URL:", cached);
      return cached.trim();
    }
  } catch (err) {
    // ignore
  }

  try {
    // 2️⃣ Try to detect your local network IP automatically
    const ip = await Network.getIpAddressAsync();
    if (ip) {
      const localURL = `http://${ip}:5000/api`;
      console.log("💻 Using local network IP:", localURL);
      return localURL;
    }
  } catch (err) {
    console.warn("⚠️ Could not detect local IP:", err.message || err);
  }

  // 3️⃣ Fallback for simulators
  console.log("📦 Using fallback:", FALLBACK_LOCAL);
  return FALLBACK_LOCAL;
}

/**
 * ✅ Create a fully configured axios instance
 */
export async function createAPI() {
  const baseURL = await getAPIBaseURL();

  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: { Accept: "application/json" },
  });

  // 🔐 Inject token on every request
  instance.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 🧩 Add detailed error logging
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response) {
        console.error("❌ Server error:", err.response.status, err.response.data);
      } else if (err.request) {
        console.error("⚠️ Network error (no response):", err.message);
      } else {
        console.error("🚨 Request setup error:", err.message);
      }
      throw err;
    }
  );

  return instance;
}

/**
 * 🔧 Convenience methods for API routes
 */
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
// src/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Network from "expo-network";
import { Platform } from "react-native";

// 👇 Optional: manually override your Ngrok URL here
// Replace this with your current Ngrok link (include /api at the end)
const MANUAL_NGROK_URL = "https://hugo-presurgical-rachelle.ngrok-free.dev/api";
// Where we store ngrok URL (if saved in-app)
const NGROK_FILE = `${FileSystem.documentDirectory}ngrok_url.txt`;

// 🧠 Default fallback for emulator/local dev
const FALLBACK_LOCAL =
  Platform.OS === "android"
    ? "http://10.0.0.2:5000/api"
    : "http://localhost:5000/api";

/**
 * ✅ STEP 1 — Save a new Ngrok or backend URL
 */
export async function setAPIBaseURL(url) {
  try {
    const clean = url.trim();
    if (!clean.startsWith("http")) throw new Error("Invalid URL format");
    await FileSystem.writeAsStringAsync(NGROK_FILE, clean);
    console.log("✅ Saved API base URL:", clean);
  } catch (err) {
    console.warn("⚠️ Failed to save API URL:", err.message || err);
  }
}

/**
 * ✅ STEP 2 — Automatically load the best backend URL
 */
export async function getAPIBaseURL() {
  // 0️⃣ Use manual Ngrok override if set
  if (MANUAL_NGROK_URL && MANUAL_NGROK_URL.startsWith("http")) {
    console.log("🌍 Using MANUAL Ngrok URL:", MANUAL_NGROK_URL);
    return MANUAL_NGROK_URL;
  }

  // 1️⃣ Check saved Ngrok URL in app storage
  try {
    const cached = await FileSystem.readAsStringAsync(NGROK_FILE);
    if (cached && cached.trim().startsWith("http")) {
      console.log("🌐 Using cached Ngrok URL:", cached.trim());
      return cached.trim();
    }
  } catch {
    // no saved URL
  }

  // 2️⃣ Detect local IP dynamically (for LAN testing)
  try {
    const ip = await Network.getIpAddressAsync();
    if (ip) {
      const local = `http://${ip}:5000/api`;
      console.log("💻 Using local network IP:", local);
      return local;
    }
  } catch (err) {
    console.warn("⚠️ Could not detect local IP:", err.message || err);
  }

  // 3️⃣ Fallback to emulator localhost
  console.log("📦 Using fallback local:", FALLBACK_LOCAL);
  return FALLBACK_LOCAL;
}

/**
 * ✅ STEP 3 — Create pre-configured Axios instance
 */
export async function createAPI() {
  const baseURL = await getAPIBaseURL();

  const instance = axios.create({
    baseURL,
    timeout: 20000,
    headers: { Accept: "application/json" },
  });

  // 🔐 Auto-attach JWT token
  instance.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 🧠 Detailed error handling
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response) {
        console.error("❌ Server Error:", err.response.status, err.response.data);
      } else if (err.request) {
        console.error("⚠️ Network Error (no response):", err.message);
      } else {
        console.error("🚨 Request Setup Error:", err.message);
      }
      throw err;
    }
  );

  return instance;
}

/**
 * 🚀 STEP 4 — Reusable API routes
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
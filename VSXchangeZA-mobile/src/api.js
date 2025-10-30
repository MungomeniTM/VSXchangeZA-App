// src/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Network from "expo-network";
import { Platform } from "react-native";

/**
 * 🌍 MANUAL OVERRIDE (Optional)
 * Replace this with your live Ngrok / production URL when needed
 * Example: "https://abcd1234.ngrok-free.app/api"
 */
const MANUAL_NGROK_URL = "https://abcd1234.ngrok-free.app/api";

// Persistent Ngrok URL file
const NGROK_FILE = `${FileSystem.documentDirectory}ngrok_url.txt`;

// 💻 Default fallback for local emulator
const FALLBACK_LOCAL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5000/api"
    : "http://localhost:5000/api";

/**
 * 🧠 STEP 1 — Save backend URL
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
 * 🧠 STEP 2 — Load backend URL dynamically
 */
export async function getAPIBaseURL() {
  // 0️⃣ Manual override if provided
  if (MANUAL_NGROK_URL && MANUAL_NGROK_URL.startsWith("http")) {
    console.log("🌍 Using manual backend URL:", MANUAL_NGROK_URL);
    return MANUAL_NGROK_URL;
  }

  // 1️⃣ Check if saved
  try {
    const cached = await FileSystem.readAsStringAsync(NGROK_FILE);
    if (cached && cached.trim().startsWith("http")) {
      console.log("🌐 Using cached Ngrok URL:", cached.trim());
      return cached.trim();
    }
  } catch {}

  // 2️⃣ Detect LAN IP (real device on same Wi-Fi)
  try {
    const ip = await Network.getIpAddressAsync();
    if (ip) {
      const local = `http://${ip}:5000/api`;
      console.log("💻 Using LAN IP:", local);
      return local;
    }
  } catch (err) {
    console.warn("⚠️ Could not detect local IP:", err.message || err);
  }

  // 3️⃣ Fallback
  console.log("📦 Using fallback local:", FALLBACK_LOCAL);
  return FALLBACK_LOCAL;
}

/**
 * ⚙️ STEP 3 — Create an axios instance with auto token + live refresh
 */
export async function createAPI() {
  const baseURL = await getAPIBaseURL();

  const instance = axios.create({
    baseURL,
    timeout: 20000,
    headers: { Accept: "application/json" },
  });

  // 🔐 Auto attach JWT
  instance.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 🧠 Unified error handler
  instance.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (err.response) {
        console.error("❌ Server responded:", err.response.status, err.response.data);
        if (err.response.status === 401) {
          // Optionally trigger auto logout or token refresh
          await AsyncStorage.removeItem("token");
          console.warn("🔒 Session expired — please log in again.");
        }
      } else if (err.request) {
        console.error("⚠️ Network Error:", err.message);
      } else {
        console.error("🚨 Request Setup Error:", err.message);
      }
      throw err;
    }
  );

  return instance;
}

/**
 * 🚀 STEP 4 — Reusable API routes (expandable)
 */

// 🧍 User authentication
export async function register(payload) {
  const api = await createAPI();
  return api.post("/auth/register", payload);
}

export async function login(payload) {
  const api = await createAPI();
  return api.post("/auth/login", payload);
}

// 📰 Posts / Feed
export async function fetchPosts() {
  const api = await createAPI();
  return api.get("/posts");
}

export async function approvePost(postId) {
  const api = await createAPI();
  return api.post(`/posts/${postId}/approve`);
}

// 👤 Profile Management (New)
export async function fetchProfile() {
  const api = await createAPI();
  return api.get("/users/profile");
}

export async function updateProfile(data) {
  const api = await createAPI();
  return api.put("/users/profile", data);
}

// 🌍 Real-time Sync (for dashboard updates)
export async function fetchLiveFeed(lastFetchedTime) {
  const api = await createAPI();
  return api.get(`/posts/live?since=${encodeURIComponent(lastFetchedTime || "")}`);
}

export default createAPI;
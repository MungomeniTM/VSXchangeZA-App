// src/config/initAPI.js
import { useEffect } from "react";
import { setAPIBaseURL } from "../api";

export default function useInitializeAPI() {
  useEffect(() => {
    // 👇 Replace this with your current ngrok forwarding link
    setAPIBaseURL("https://hugo-presurgical-rachelle.ngrok-free.dev/api");
  }, []);
}
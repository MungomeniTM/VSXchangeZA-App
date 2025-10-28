// src/config/initAPI.js
import { useEffect } from "react";
import { setAPIBaseURL } from "../api";

export default function useInitializeAPI() {
  useEffect(() => {
    // 👇 Replace this with your current ngrok forwarding link
    setAPIBaseURL("https://YOUR-NGROK-LINK.ngrok-free.app/api");
  }, []);
}
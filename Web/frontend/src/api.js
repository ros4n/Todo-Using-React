// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // Django backend
  withCredentials: true,             // ✅ important for session cookies
  headers: {
    "Content-Type": "application/json", // ensures JSON is sent
  },
});

export default api;

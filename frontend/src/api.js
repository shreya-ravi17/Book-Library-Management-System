import axios from "axios";

// Set VITE_API_URL in frontend/.env when deploying (see .env.example)
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
});

export default api;

import axios from "axios";

// Production builds (PROD=true) always use same-origin "/api" because the
// Express server serves client/dist itself (Render single-service deploy).
// Local `vite` dev uses VITE_API_BASE_URL from client/.env instead.
const api = axios.create({
  baseURL: import.meta.env.PROD
    ? "/api"
    : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api`,
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("meditrust-auth");
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore corrupt storage
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("meditrust-auth");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;

import axios from "axios";
import {
  BASE_URL,
  LOG_OUT_URL,
  LOG_OUT_URL_ALL,
  REFRESH_URL,
  SESSION_NAME,
} from "./urls";

// Global state for authentication
let accessToken: any = null;
let sessionId = localStorage.getItem(SESSION_NAME) || null;

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Functions to manage global state
export const setAccessToken = (token: any) => {
  accessToken = token;
};

export const setSessionId = (id: any) => {
  sessionId = id;
  if (id) {
    localStorage.setItem(SESSION_NAME, id);
  } else {
    localStorage.removeItem(SESSION_NAME);
  }
};

export const getAccessToken = () => accessToken;
export const getSessionId = () => sessionId;

export const logout = async (allDevices = false) => {
  try {
    if (allDevices) {
      await api.post(LOG_OUT_URL_ALL);
    } else if (sessionId) {
      await api.post(LOG_OUT_URL, { sessionId });
    }
  } catch (err) {
    console.error("Logout failed", err);
  }
  setAccessToken(null);
  setSessionId(null);
};

// Request interceptor
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response?.status === 403 || error.response?.status === 401) &&
      !originalRequest._retry &&
      sessionId
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(REFRESH_URL, {
          sessionId,
        });
        setAccessToken(data.token);
        originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (err) {
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;

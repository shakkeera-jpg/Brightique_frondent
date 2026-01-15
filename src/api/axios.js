import axios from "axios";

export const base = import.meta.env.VITE_API_BASE_URL;;

const api = axios.create({
  baseURL: base,
});

// REQUEST
api.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// RESPONSE (AUTO REFRESH)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh")
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${base}token/refresh/`, {
          refresh: localStorage.getItem("refresh"),
        });

        localStorage.setItem("access", res.data.access);
        api.defaults.headers.Authorization = `Bearer ${res.data.access}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api",
  withCredentials: true,
});

// Attach Authorization token to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token"); // Or however you're storing the token
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle errors globally (optional but useful)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || "Something went wrong");
  }
);

export default API;

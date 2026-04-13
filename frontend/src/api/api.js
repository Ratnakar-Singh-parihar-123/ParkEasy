import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "http://10.93.141.211:8000/api", // ⚠️ apna backend IP yaha daalo
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Request Interceptor (token attach karega)
API.interceptors.request.use(
  async (req) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error),
);

// ⚠️ Optional: Response Interceptor (token expire handle)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    }
    return Promise.reject(error);
  },
);

export default API;

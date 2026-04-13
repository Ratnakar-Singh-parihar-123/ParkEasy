// api/parkingApi.js

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ axios instance
const API = axios.create({
  baseURL: "https://parkeasy-5qpq.onrender.com/api/admin/parkings",
});

// ✅ interceptor yahi likhna hai
API.interceptors.request.use(
  async (req) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ✅ API functions
export const getParkings = () => API.get("/");
export const createParking = (data) => API.post("/", data);
export const updateParking = (id, data) => API.put(`/${id}`, data);
export const deleteParking = (id) => API.delete(`/${id}`);
export const markFull = (id) => API.put(`/${id}/full`);

// api/dashboardApi.js

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "http://10.93.141.211:8000/api/admin",
});

// 🔐 token auto attach
API.interceptors.request.use(async (req) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// 🔥 GET DASHBOARD STATS
export const getDashboardStats = () => API.get("/dashboard/stats");

// 🔥 GET RECENT BOOKINGS
export const getRecentBookings = () => API.get("/dashboard/recent-bookings");

// api/userBookingApi.js

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "http://10.93.141.211:8000/api",
});

API.interceptors.request.use(async (req) => {
  const token = await AsyncStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ✅ get my bookings
export const getMyBookings = () => API.get("/user/my-bookings");

// ✅ cancel booking
export const cancelBookingApi = (id) => API.put(`/bookings/${id}/cancel`);

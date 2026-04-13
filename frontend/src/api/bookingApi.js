// api/bookingApi.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "https://parkeasy-5qpq.onrender.com/api/admin",
});

API.interceptors.request.use(async (req) => {
  const token = await AsyncStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getBookings = () => API.get("/bookings");
export const completeBooking = (id) => API.put(`/bookings/${id}/complete`);
export const cancelBookingApi = (id) => API.put(`/bookings/${id}/cancel`);

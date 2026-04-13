// api/bookingApi.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "http://10.93.141.211:8000/api/admin",
});

API.interceptors.request.use(async (req) => {
  const token = await AsyncStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getBookings = () => API.get("/bookings");
export const completeBooking = (id) => API.put(`/bookings/${id}/complete`);
export const cancelBookingApi = (id) => API.put(`/bookings/${id}/cancel`);

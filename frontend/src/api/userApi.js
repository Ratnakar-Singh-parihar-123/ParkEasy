// api/userApi.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "https://parkeasy-5qpq.onrender.com/api/admin",
});

//  TOKEN
API.interceptors.request.use(async (req) => {
  const token = await AsyncStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

//
// ==========================
//  USERS APIs
// ==========================
export const getUsers = () => API.get("/users");
export const deactivateUserApi = (id) => API.put(`/users/${id}/deactivate`);
export const activateUserApi = (id) => API.put(`/users/${id}/activate`);

//
// ==========================
// 🚗 BOOKINGS APIs (ADD THIS 🔥)
// ==========================

//  GET ALL BOOKINGS
export const getBookings = () => API.get("/bookings");

//  COMPLETE BOOKING
export const completeBooking = (id) => API.put(`/bookings/${id}/complete`);

//  CANCEL BOOKING
export const cancelBookingApi = (id) => API.put(`/bookings/${id}/cancel`);

export default API;

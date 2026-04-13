// api/userBookingApi.js

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "https://parkeasy-5qpq.onrender.com/api",
});

API.interceptors.request.use(async (req) => {
  const token = await AsyncStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

//  get my bookings
export const getMyBookings = () => API.get("/user/my-bookings");

//  cancel booking
export const cancelBookingApi = (id) => API.put(`/bookings/${id}/cancel`);

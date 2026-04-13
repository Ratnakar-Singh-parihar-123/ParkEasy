import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "http://10.93.141.211:8000/api",
});

// 🔐 TOKEN AUTO ATTACH
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

//
// ================= USER APIs =================
//

// ✅ Get all parkings
export const getAllParkings = () => API.get("/user/parkings");

// ✅ Get single parking
export const getParkingById = (id) => API.get(`/user/parkings/${id}`);

// ✅ Create booking
export const createBooking = (data) => API.post("/user/bookings", data);

// ✅ My bookings
export const getMyBookings = () => API.get("/user/my-bookings");

// ✅ Cancel booking (🔥 FIXED)
export const cancelBookingApi = (id) => API.put(`/user/bookings/${id}/cancel`);

export default API;

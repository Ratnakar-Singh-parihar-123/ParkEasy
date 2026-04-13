// fetchApi.js

const BASE_URL = "http://10.93.141.211:8000"; // direct backend IP

// Helper: get token from local storage (ya hardcode for testing)
const getToken = () => {
  // Agar aap React Native AsyncStorage use kar rahe ho:
  // return await AsyncStorage.getItem("token");

  // Test ke liye hardcode
  return "YOUR_ADMIN_JWT_TOKEN";
};

// Common fetch function with auth header
const fetchWithAuth = async (endpoint) => {
  const token = getToken();
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Request failed");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err.message);
    return [];
  }
};

// Fetch admin users
export const fetchUsers = async () => {
  return await fetchWithAuth("/api/admin/users");
};

// Fetch parking data
// export const fetchParking = async () => {
//   return await fetchWithAuth("/api/admin/parking");
// };

// Fetch bookings
// export const fetchBookings = async () => {
//   return await fetchWithAuth("/api/admin/bookings");
// };

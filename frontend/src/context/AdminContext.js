// Example: fetch users from backend
export const fetchUsers = async () => {
  const res = await fetch("https://parkeasy-5qpq.onrender.com/api/admin/users");
  const data = await res.json();
  console.log(data);
};
// Example: fetch parking
export const fetchParking = async () => {
  const res = await fetch(
    "https://parkeasy-5qpq.onrender.com/api/admin/parking",
  );
  const data = await res.json();
  console.log(data);
};
// Example: fetch bookings
export const fetchBookings = async () => {
  const res = await fetch(
    "https://parkeasy-5qpq.onrender.com/api/admin/bookings",
  );
  const data = await res.json();
  console.log(data);
};

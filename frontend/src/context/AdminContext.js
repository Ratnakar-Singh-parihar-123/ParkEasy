// Example: fetch users from backend
export const fetchUsers = async () => {
  const res = await fetch("http://10.184.108.211:8000/api/admin/users");
  const data = await res.json();
  console.log(data);
};
// Example: fetch parking
export const fetchParking = async () => {
  const res = await fetch("http://10.184.108.211:8000/api/admin/parking");
  const data = await res.json();
  console.log(data);
};
// Example: fetch bookings
export const fetchBookings = async () => {
  const res = await fetch("http://10.184.108.211:8000/api/admin/bookings");
  const data = await res.json();
  console.log(data);
};

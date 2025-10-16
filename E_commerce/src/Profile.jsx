import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

  // Fetch user info
  useEffect(() => {
    if (!userId) {
      setLoadingUser(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/getUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  // Fetch user's orders
  useEffect(() => {
    if (!userName) {
      setLoadingOrders(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/getOrders/${userName}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [userName]);

  if (loadingUser || loadingOrders)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  if (!user) return <p className="text-center mt-5">User not found. Please login.</p>;

  // Helper function for status colors
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-success text-white rounded px-2 py-1";
      case "cancelled":
        return "bg-danger text-white rounded px-2 py-1";
        case "confirmed":
        return "bg-danger text-white rounded px-2 py-1";
      case "pending":
      default:
        return "bg-primary text-white rounded px-2 py-1";
    }
  };

  // 🗑️ Delete Account Handler
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await axios.delete(`http://localhost:3001/deleteUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear localStorage and navigate to login
      localStorage.clear();
      alert("Your account has been deleted successfully.");
      navigate("/login");
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("Failed to delete account. Please try again later.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container className="mt-5" style={{height:"100vh" }}>
      <div className="mb-4" style={{marginTop:"200px"}}>
  <div className="d-flex justify-content-between align-items-center">
    <div>
      <h2 className="mb-1">{user.name}</h2>
      <p className="mb-0">
        <strong>Phone:</strong> {user.phone || "Not provided"}
      </p>
    </div>

    {/* 🗑️ Delete Account Button */}
    <Button
      variant="danger"
      onClick={handleDeleteAccount}
      disabled={deleting}
    >
      {deleting ? "Deleting..." : "Delete Account"}
    </Button>
  </div>
</div>


      <h3 className="mb-3 text-center">Your Orders</h3>
      {orders.length === 0 ? (
        <p className="text-center text-muted">No orders placed yet.</p>
      ) : (
        <Table striped bordered hover responsive className="text-center align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Items</th>
              <th>Total Amount (₹)</th>
              <th>Phone</th>
              <th>Payment Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order._id}</td>
                <td>
                  {order.items.map((item) => (
                    <div key={item.product}>
                      {item.name} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td>{order.totalAmount}</td>
                <td>{order.phone}</td>
                <td>{order.paymentMethod}</td>
                <td>
                  <span className={getStatusClass(order.status || "pending")}>
                    {order.status || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Profile;

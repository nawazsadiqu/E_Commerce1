import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (location.state && location.state.order) {
      setOrder(location.state.order);
    } else {
      
      navigate("/");
    }
  }, [location, navigate]);

  if (!order) return null;

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-250"
      style={{ backgroundColor: "#fdfdfdff", marginBottom:"120px" }}
    >
      <div
        className="text-center p-5 rounded shadow"
        style={{
          backgroundColor: "#28a745",
          color: "white",
          height:"660px",
          maxWidth: "550px",
          width: "90%",
        }}
      >
        <h2 className="mb-3">✅ Order Placed Successfully!</h2>
        <p className="mb-4">
          Thank you for your purchase. Your order has been confirmed and will be
          delivered soon.
        </p>

        <div
          className="text-start p-3 rounded"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            color: "white",
          }}
        >
          <h5 className="mb-3 text-center"> Order Details</h5>
          <p>
            <strong>Order ID:</strong> {order._id || "N/A"}
          </p>
          <p>
            <strong>Name:</strong> {order.name}
          </p>
          <p>
            <strong>Address:</strong> {order.address}, {order.city} -{" "}
            {order.pincode}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Payment:</strong> {order.paymentMethod}
          </p>
          <p className="fw-bold">Total Amount: ₹{order.totalAmount}</p>

          <h6 className="mt-3">Items:</h6>
          <ul className="list-unstyled">
            {order.items.map((item, index) => (
              <li key={index} className="border-bottom py-2">
                {item.name || item.product?.name} × {item.quantity} — ₹
                {item.price * item.quantity}
              </li>
            ))}
          </ul>
        </div>

        <button
          className="btn btn-light mt-4"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;

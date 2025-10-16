import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const user = localStorage.getItem("userName");
  if (!user) alert("⚠ Please login to access your cart.");

  // Fetch cart items
  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`https://e-commerce-03kf.onrender.com/getCart/${user}`);
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Remove item
  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      const res = await axios.delete(
        `https://e-commerce-03kf.onrender.com/removeFromCart/${user}/${productId}`
      );
      setCartItems(res.data.cart.items || []);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to remove item");
    }
  };

  // Update quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (!user || newQuantity < 1) return;
    try {
      const res = await axios.put(
        `https://e-commerce-03kf.onrender.com/updateCart/${user}/${productId}`,
        { quantity: newQuantity }
      );
      setCartItems(res.data.cart.items || []);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update quantity");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-5 position-relative" style={{minheight:"100vh"}}>
      <h2 className="mb-4">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>No items in your cart.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.product._id || item._id}
              className="card mb-3 p-3 shadow-sm"
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={item.image || item.product.image}
                    alt={item.name || item.product.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                  <div>
                    <h5>{item.name || item.product.name}</h5>
                    <p className="text-muted mb-1">₹{item.price}</p>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          updateQuantity(
                            item.product._id || item._id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          updateQuantity(
                            item.product._id || item._id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    removeFromCart(item.product._id || item._id)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <h4 className="text-end mt-4 fw-bold">Total: ₹{total}</h4>

          {/* Proceed to Checkout Button */}
          <div className="text-end mt-3">
            <button
              className="btn btn-success btn-lg"
              onClick={() => setShowCheckout(true)}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {/* ------------------ Checkout Overlay ------------------ */}
      {showCheckout && (
        <CheckoutForm
          cartItems={cartItems}
          total={total}
          user={user}
          onClose={() => setShowCheckout(false)}
          onOrderPlaced={() => {
            setCartItems([]);
            setShowCheckout(false);
          }}
        />
      )}
    </div>
  );
};

// ------------------ CheckoutForm Component ------------------
const CheckoutForm = ({ cartItems, total, user, onClose, onOrderPlaced }) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !city || !address || !pincode || !phone)
      return alert("Please fill all fields");

    setLoading(true);
    try {
      const res = await axios.post("https://e-commerce-03kf.onrender.com/createOrder", {
        user,
        items: cartItems,
        totalAmount: total,
        name,
        city,
        address,
        pincode,
        phone,
        paymentMethod,
      });

      if (res.status === 200) {
        onOrderPlaced(); // clear cart, close overlay, etc.
      navigate("/success", { state: { order: res.data.order } });
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
    >
      <div className="bg-white p-4 rounded shadow" style={{ width: "400px" }}>
        <h4 className="mb-3">Checkout</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label>Name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label>City</label>
            <input
              className="form-control"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label>Address</label>
            <textarea
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="2"
              required
            />
          </div>
          <div className="mb-2">
            <label>Pincode</label>
            <input
              className="form-control"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label>Phone Number</label>
            <input
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Payment Method</label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="Online">Online Payment</option>
            </select>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Placing..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cart;

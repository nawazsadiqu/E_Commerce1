import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://e-commerce-03kf.onrender.com/login", form);
      alert(res.data.message);

      // Store token, userId, and userName in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("userName", res.data.user.name);

      // Navigate to home page
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5 ">
      <div className="row justify-content-center" style={{height:"80vh"}}>
        <div className="col-md-6"style={{marginTop:"100px"}}>
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">Login</h3>
            <form onSubmit={handleSubmit}>
              <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="form-control mb-3"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className="form-control mb-4"
              />
              <button className="btn btn-success w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Login;

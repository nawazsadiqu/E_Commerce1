import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const navigate = useNavigate(); // ✅ Create navigate instance

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://e-commerce-03kf.onrender.com/register", form);
      alert(res.data.message);

      // ✅ Navigate to login page after successful registration
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container mt-1 mb-5"style={{height:"100vh"}}>
      <h3 className="text-center mb-4" style={{marginTop:"170px"}}>Register</h3>
      <div className="row justify-content-center mb-5">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                className="form-control mb-3"
              />
              <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="form-control mb-3"
              />
              <input
                name="phone"
                placeholder="Phone No"
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
              <button className="btn btn-primary w-100">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

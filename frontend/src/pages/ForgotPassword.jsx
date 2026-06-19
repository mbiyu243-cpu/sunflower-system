import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function ForgotPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    new_password: "",
    confirm_password: "",
  });

  const resetPassword = async (e) => {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.put(`${API_URL}/forgot-password`, {
        email: form.email,
        new_password: form.new_password,
      });

      alert("Password reset successfully. You can now log in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reset password");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-header bg-success text-white text-center">
          <h3>Forgot Password</h3>
        </div>

        <div className="card-body">
          <form onSubmit={resetPassword}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control mb-3"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control mb-3"
              value={form.new_password}
              onChange={(e) =>
                setForm({ ...form, new_password: e.target.value })
              }
              required
            />

            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-control mb-4"
              value={form.confirm_password}
              onChange={(e) =>
                setForm({ ...form, confirm_password: e.target.value })
              }
              required
            />

            <button className="btn btn-success w-100">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
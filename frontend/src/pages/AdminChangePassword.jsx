import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function AdminChangePassword() {
  const [form, setForm] = useState({
    email: "admin@sunflower.com",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const submitChange = async (e) => {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      alert("New passwords do not match");
      return;
    }

    try {
      await axios.put(`${API_URL}/admin/change-password`, {
        email: form.email,
        current_password: form.current_password,
        new_password: form.new_password,
      });

      alert("Password changed successfully");

      setForm({
        ...form,
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to change password");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-header bg-success text-white text-center">
          <h3>Change Admin Password</h3>
        </div>

        <div className="card-body">
          <form onSubmit={submitChange}>
            <label className="form-label">Admin Email</label>
            <input
              className="form-control mb-3"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-control mb-3"
              value={form.current_password}
              onChange={(e) =>
                setForm({ ...form, current_password: e.target.value })
              }
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
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminChangePassword;
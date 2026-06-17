import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FarmerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    id_number: "",
    contact: "",
    location: "",
    age: "",
    farm_size: "",
    registration_fee: 1000,
    payment_status: "Pending",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitRegistration = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    const res = await axios.post("http://localhost:8080/farmers", {
      name: form.name,
      id_number: form.id_number,
      contact: form.contact,
      location: form.location,
      age: Number(form.age),
      farm_size: Number(form.farm_size),
      registration_fee: Number(form.registration_fee),
      payment_status: form.payment_status,
      email: form.email,
      password: form.password,
    });

    await axios.put(
      `http://localhost:8080/farmers/${res.data.ID}/simulate-payment`
    );

    alert("Registration successful. You can now log in.");

    setForm({
      name: "",
      id_number: "",
      contact: "",
      location: "",
      age: "",
      farm_size: "",
      registration_fee: 1000,
      payment_status: "Pending",
      email: "",
      password: "",
      confirm_password: "",
    });

    navigate("/login");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">🌻 Farmer Self Registration</h3>
            </div>

            <div className="card-body">
              <p className="text-muted">
                Register below to participate in the sunflower seed distribution project.
              </p>

              <form onSubmit={submitRegistration}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">ID Number</label>
                  <input
                    className="form-control"
                    name="id_number"
                    value={form.id_number}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">M-Pesa Phone Number</label>
                  <input
                    className="form-control"
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="07XXXXXXXX"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    className="form-control"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-control"
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Farm Size</label>
                    <input
                      type="number"
                      className="form-control"
                      name="farm_size"
                      value={form.farm_size}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <hr />

                <h5 className="mb-3">Create Farmer Login Account</h5>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirm_password"
                      value={form.confirm_password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="alert alert-warning">
  <h5>📱 M-Pesa PayBill Payment</h5>

  <p>
    <strong>PayBill Number:</strong> 123456
  </p>

  <p>
    <strong>Account Number:</strong>{" "}
    {form.id_number || "Enter your ID Number"}
  </p>

  <p>
    <strong>Amount:</strong> KES {form.registration_fee}
  </p>

  <hr />

  <small>
    After making payment, complete registration and submit your
    M-Pesa transaction code from your dashboard.
  </small>
</div>

                <button className="btn btn-success btn-lg w-100">
                  Register & Create Farmer Account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerRegister;
import { useEffect, useState } from "react";
import axios from "axios";
import "./FarmerDashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

function FarmerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [farmer, setFarmer] = useState(null);
  const [mpesaCode, setMpesaCode] = useState("");

  useEffect(() => {
    if (user?.farmer_id) {
      axios
        axios.get(`${API_URL}/farmer-dashboard/${user.farmer_id}`)
        .then((res) => setFarmer(res.data))
        .catch((err) => console.error(err));
    }
  }, []);

  const submitMpesaCode = async () => {
  try {
    awaitaxios.put(
  `${API_URL}/farmers/${farmer.ID}/submit-mpesa-code`,
      {
        mpesa_code: mpesaCode,
      }
    );

    alert("Payment code submitted successfully");

    const res = awaitaxios.get(
  `${API_URL}/farmer-dashboard/${user.farmer_id}`
)

    setFarmer(res.data);
    setMpesaCode("");
  } catch (err) {
    console.error(err);
    alert("Failed to submit code");
  }
};

  const isPaid = farmer?.payment_status === "Paid";
  const isVerified = farmer?.verification_status === "Verified";
  const isAllocated = farmer?.seed_status === "Allocated";
  const isCollected = farmer?.collection_status === "Collected";

  const stepClass = (done) =>
    done ? "bg-success text-white" : "bg-light text-muted border";

  const printAllocationSlip = () => {
  window.print();
};

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0 mb-4">
        <div className="card-header bg-success text-white text-center">
          <h3 className="mb-0">🌻 Farmer Dashboard</h3>
        </div>

        <div className="card-body text-center">
          <h4>Welcome, {user?.name}</h4>
          <p className="text-muted">
            Track your registration, payment, verification, seed allocation, and collection progress.
          </p>
        </div>
      </div>

      {farmer && (
        <>
          <div className="row g-3 mb-4 text-center">
            <div className="col-md">
              <div className={`card p-3 h-100 ${stepClass(true)}`}>
                <strong>1. Registered</strong>
              </div>
            </div>

            <div className="col-md">
              <div className={`card p-3 h-100 ${stepClass(isPaid)}`}>
                <strong>2. Payment</strong>
              </div>
            </div>

            <div className="col-md">
              <div className={`card p-3 h-100 ${stepClass(isVerified)}`}>
                <strong>3. Verification</strong>
              </div>
            </div>

            <div className="col-md">
              <div className={`card p-3 h-100 ${stepClass(isAllocated)}`}>
                <strong>4. Allocation</strong>
              </div>
            </div>

            <div className="col-md">
              <div className={`card p-3 h-100 ${stepClass(isCollected)}`}>
                <strong>5. Collection</strong>
              </div>
            </div>
          </div>

          {!isVerified && farmer.verification_status !== "Rejected" && (
            <div className="alert alert-warning text-center">
              Your payment is received. Please wait for admin verification.
            </div>
          )}

          {farmer.verification_status === "Rejected" && (
            <div className="alert alert-danger text-center">
              Your registration was rejected. Please contact the project administrator.
            </div>
          )}

          {isVerified && !isAllocated && (
            <div className="alert alert-info text-center">
              You are verified. Seed allocation is pending.
            </div>
          )}

          {isAllocated && !isCollected && (
            <div className="alert alert-primary text-center">
              Your seeds have been allocated. Please wait for collection instructions.
            </div>
          )}

          {isCollected && (
            <div className="alert alert-success text-center">
              Seeds collected successfully. Thank you for participating.
            </div>
          )}

          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card shadow border-0 text-center h-100">
                <div className="card-body">
                  <h6>Payment Status</h6>
                  <span className={`badge ${isPaid ? "bg-success" : "bg-warning text-dark"}`}>
                    {farmer.payment_status || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow border-0 text-center h-100">
                <div className="card-body">
                  <h6>Verification</h6>
                  <span
                    className={`badge ${
                      isVerified
                        ? "bg-success"
                        : farmer.verification_status === "Rejected"
                        ? "bg-danger"
                        : "bg-secondary"
                    }`}
                  >
                    {farmer.verification_status || "Not Verified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow border-0 text-center h-100">
                <div className="card-body">
                  <h6>Seed Allocation</h6>
                  <span className={`badge ${isAllocated ? "bg-success" : "bg-secondary"}`}>
                    {farmer.seed_status || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow border-0 text-center h-100">
                <div className="card-body">
                  <h6>Bags Allocated</h6>
                  <h3 className="fw-bold text-success">
                    {farmer.bags_allocated || 0}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-lg border-0">
            <div className="card-header bg-white">
              <h4 className="mb-0">My Farmer Profile</h4>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Name:</strong> {farmer.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>ID Number:</strong> {farmer.id_number}</p>
                  <p><strong>Phone:</strong> {farmer.contact}</p>
                  <p><strong>Location:</strong> {farmer.location}</p>
                </div>

                <div className="col-md-6">
                  <p><strong>Farm Size:</strong> {farmer.farm_size}</p>
                  <p><strong>Registration Fee:</strong> KES {farmer.registration_fee}</p>
                  <p><strong>M-Pesa Receipt:</strong> {farmer.mpesa_receipt || "Not available"}</p>
                  <hr />

<h5>📱 PayBill Payment</h5>

<p>
  <strong>PayBill Number:</strong>{" "}
  {farmer.paybill_number || "123456"}
</p>

<p>
  <strong>Account Number:</strong>{" "}
  {farmer.account_number || farmer.id_number}
</p>

<p>
  <strong>Submitted Code:</strong>{" "}
  {farmer.submitted_mpesa_code || "Not submitted"}
</p>

{farmer.collection_status === "Collected" ? (
  <div className="alert alert-success">
    Seeds collected successfully. Thank you for participating.
  </div>
) : farmer.seed_status === "Allocated" ? (
  <div className="alert alert-primary">
    Your seeds have been allocated. Please collect them from the assigned center.
  </div>
) : farmer.verification_status === "Verified" ? (
  <div className="alert alert-success">
    Your payment has been confirmed and your account is verified.
  </div>
) : farmer.submitted_mpesa_code ? (
  <div className="alert alert-info">
    Your M-Pesa code has been submitted and is awaiting admin confirmation.
  </div>
) : (
  <>
    <input
      type="text"
      className="form-control mb-2"
      placeholder="Enter M-Pesa Code"
      value={mpesaCode}
      onChange={(e) => setMpesaCode(e.target.value)}
    />

    <button
      className="btn btn-success"
      onClick={submitMpesaCode}
      disabled={!mpesaCode}
    >
      Submit Payment Code
    </button>
  </>
)}

<p>
  <strong>Collection Center:</strong>{" "}
  {farmer.collection_center || "Nairobi Depot"}
</p>

<p>
  <strong>Collection Date:</strong>{" "}
  {farmer.collection_date || "2026-06-20"}
</p>

                  <p><strong>Transaction ID:</strong> {farmer.transaction_id || "Not available"}</p>
                  <p>
  <strong>Collection Status:</strong>{" "}
  <span
    className={`badge ${
      isCollected ? "bg-success" : "bg-warning text-dark"
    }`}
  >
    {farmer.collection_status || "Pending"}
  </span>
</p>

{farmer.seed_status === "Allocated" && (
  <button
    className="btn btn-outline-success mt-3"
    onClick={printAllocationSlip}
  >
    Print Allocation Slip
  </button>
)}
                </div>
              </div>
            </div>
          </div>
          {farmer.seed_status === "Allocated" && (
  <div className="card shadow-lg border-0 mt-4" id="allocation-slip">
    <div className="card-header bg-success text-white text-center">
      <h4 className="mb-0">🌻 Seed Allocation Slip</h4>
    </div>

    <div className="card-body">
      <h5 className="text-center mb-4">Sunflower Farmers Management System</h5>

      <div className="row">
        <div className="col-md-6">
          <p><strong>Farmer Name:</strong> {farmer.name}</p>
          <p><strong>ID Number:</strong> {farmer.id_number}</p>
          <p><strong>Phone:</strong> {farmer.contact}</p>
          <p><strong>Location:</strong> {farmer.location}</p>
        </div>

        <div className="col-md-6">
          <p><strong>Verification Status:</strong> {farmer.verification_status}</p>
          <p><strong>Seed Status:</strong> {farmer.seed_status}</p>
          <p><strong>Bags Allocated:</strong> {farmer.bags_allocated}</p>

<p>
  <strong>Collection Center:</strong>{" "}
  {farmer.collection_center || "Nairobi Depot"}
</p>

<p>
  <strong>Collection Date:</strong>{" "}
  {farmer.collection_date || "2026-06-20"}
</p>

        </div>
      </div>

      <hr />

      <p>
        <strong>Note:</strong> Please carry your National ID when collecting seeds.
      </p>

      <div className="mt-5 d-flex justify-content-between">
        <div>
          <p>_________________________</p>
          <p>Farmer Signature</p>
        </div>

        <div className="text-center">
  <div className="text-center">
  <div style={{ marginBottom: "10px" }}>
    ______________________
  </div>

  <div style={{ marginBottom: "20px" }}>
    Officer Signature
  </div>

  <div style={{ marginBottom: "10px" }}>
    <strong>Officer Name:</strong> __________________
  </div>

  <div>
    <strong>Date Issued:</strong> {new Date().toLocaleDateString()}
  </div>
</div>
</div>
      </div>
    </div>
  </div>
)}
        </>
      )}
    </div>
  );
}

export default FarmerDashboard;
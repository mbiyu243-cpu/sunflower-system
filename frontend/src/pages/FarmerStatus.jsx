import { useState } from "react";
import axios from "axios";

function FarmerStatus() {
  const [idNumber, setIdNumber] = useState("");
  const [contact, setContact] = useState("");
  const [farmer, setFarmer] = useState(null);
  const [error, setError] = useState("");

  const checkStatus = async (e) => {
    e.preventDefault();
    setError("");
    setFarmer(null);

    try {
      const res = await axios.get(
        `http://localhost:8080/farmers/status/check?id_number=${idNumber}&contact=${contact}`
      );

      setFarmer(res.data);
    } catch (err) {
      setError("No farmer found with those details.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">Check Farmer Status</h3>
            </div>

            <div className="card-body">
              <form onSubmit={checkStatus}>
                <div className="mb-3">
                  <label className="form-label">ID Number</label>
                  <input
                    className="form-control"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-control"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                  />
                </div>

                <button className="btn btn-success w-100">
                  Check Status
                </button>
              </form>

              {error && (
                <div className="alert alert-danger mt-4">
                  {error}
                </div>
              )}

              {farmer && (
                <div className="card mt-4 border-0 bg-light">
                  <div className="card-body">
                    <h4>{farmer.name}</h4>
                    <p><strong>ID Number:</strong> {farmer.id_number}</p>
                    <p><strong>Phone:</strong> {farmer.contact}</p>
                    <p><strong>Location:</strong> {farmer.location}</p>
                    <p><strong>Farm Size:</strong> {farmer.farm_size}</p>

                    <hr />

                    <p>
                      <strong>Payment Status:</strong>{" "}
                      <span className={`badge ${farmer.payment_status === "Paid" ? "bg-success" : "bg-warning text-dark"}`}>
                        {farmer.payment_status}
                      </span>
                    </p>

                    <p>
                      <strong>Verification Status:</strong>{" "}
                      <span className={`badge ${farmer.verification_status === "Verified" ? "bg-success" : "bg-secondary"}`}>
                        {farmer.verification_status || "Not Verified"}
                      </span>
                    </p>

                    <p>
                      <strong>M-Pesa Receipt:</strong>{" "}
                      {farmer.mpesa_receipt || "Not available"}
                    </p>
                      <p>
  <strong>Seed Allocation Status:</strong>{" "}
  <span
    className={`badge ${
      farmer.seed_status === "Allocated"
        ? "bg-success"
        : "bg-secondary"
    }`}
  >
    {farmer.seed_status || "Pending"}
  </span>
</p>

<p>
  <strong>Bags Allocated:</strong>{" "}
  {farmer.bags_allocated || 0}
</p>

<p>
  <strong>Collection Status:</strong>{" "}
  <span
    className={`badge ${
      farmer.collection_status === "Collected"
        ? "bg-success"
        : "bg-warning text-dark"
    }`}
  >
    {farmer.collection_status || "Pending"}
  </span>
</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerStatus;
import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [farmers, setFarmers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [showAllocationForm, setShowAllocationForm] = useState(false);

const [allocationData, setAllocationData] = useState({
  bags_allocated: "",
  collection_center: "",
  collection_date: "",
});

  const [stats, setStats] = useState({
    total_farmers: 0,
    verified_farmers: 0,
    pending_verification: 0,
    paid_farmers: 0,
    unpaid_farmers: 0,
    total_revenue: 0,
    seed_allocations: 0,
    seeds_allocated: 0,
    seeds_collected: 0,
    pending_collection: 0,
  });

  const [form, setForm] = useState({
    name: "",
    id_number: "",
    contact: "",
    location: "",
    age: "",
    farm_size: "",
    registration_fee: 1000,
    payment_status: "Pending",
  });

  const fetchStats = () => {
    axios
      .get("http://localhost:8080/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  };

  const fetchFarmers = () => {
    axios
      .get("http://localhost:8080/farmers")
      .then((res) => setFarmers(res.data))
      .catch((err) => console.error(err));
  };

  const fetchAllocations = () => {
    axios
      .get("http://localhost:8080/seed-allocations")
      .then((res) => setAllocations(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchStats();
    fetchFarmers();
    fetchAllocations();
  }, []);

  const refreshData = () => {
    fetchStats();
    fetchFarmers();
    fetchAllocations();
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registerFarmer = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/farmers", {
        ...form,
        age: Number(form.age),
        farm_size: Number(form.farm_size),
        registration_fee: Number(form.registration_fee),
      });

      alert("Farmer registered successfully");

      setForm({
        name: "",
        id_number: "",
        contact: "",
        location: "",
        age: "",
        farm_size: "",
        registration_fee: 1000,
        payment_status: "Pending",
      });

      refreshData();
    } catch (error) {
      alert(error.response?.data?.error || "Farmer registration failed");
    }
  };

  const markPaid = async (id) => {
    try {
      await axios.put(`http://localhost:8080/farmers/${id}/payment`, {
        payment_status: "Paid",
      });

      refreshData();
      alert("Payment marked as Paid");
    } catch (error) {
      alert(error.response?.data?.error || "Payment update failed");
    }
  };

  const approvePayment = async (id) => {
    try {
      await axios.put(`http://localhost:8080/farmers/${id}/payment`, {
        payment_status: "Paid",
      });

      refreshData();
      alert("Payment approved successfully");
    } catch (error) {
      alert(error.response?.data?.error || "Payment approval failed");
    }
  };

  const verifyFarmer = async (id) => {
    try {
      await axios.put(`http://localhost:8080/farmers/${id}/verify`);

      refreshData();
      alert("Farmer verified successfully");
    } catch (error) {
      alert(error.response?.data?.error || "Verification failed");
    }
  };

  const rejectFarmer = async (id) => {
    try {
      await axios.put(`http://localhost:8080/farmers/${id}/reject`);

      refreshData();
      alert("Farmer rejected successfully");
    } catch (error) {
      alert(error.response?.data?.error || "Rejection failed");
    }
  };

  const updateFarmer = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8080/farmers/${editingFarmer.ID}`, {
        name: editingFarmer.name,
        contact: editingFarmer.contact,
        location: editingFarmer.location,
        age: Number(editingFarmer.age),
        farm_size: Number(editingFarmer.farm_size),
      });

      alert("Farmer updated successfully");
      setEditingFarmer(null);
      refreshData();
    } catch (error) {
      alert(error.response?.data?.error || "Update failed");
    }
  };

  const getAllocation = (farmerId) => {
    return allocations.find((allocation) => allocation.farmer_id === farmerId);
  };

  const allocateSeeds = async () => {
  try {
    await axios.post("http://localhost:8080/seed-allocations", {
      farmer_id: selectedFarmer.ID,
      bags_allocated: Number(allocationData.bags_allocated),
      collection_center: allocationData.collection_center,
      collection_date: allocationData.collection_date,
    });

    alert("Seeds allocated successfully");

    setShowAllocationForm(false);

    setAllocationData({
      bags_allocated: "",
      collection_center: "",
      collection_date: "",
    });

    refreshData();
  } catch (error) {
    alert(error.response?.data?.error || "Seed allocation failed");
  }
};

  const markCollected = async (allocationId) => {
    try {
      await axios.put(
        `http://localhost:8080/seed-allocations/${allocationId}/collect`
      );

      refreshData();
      alert("Seeds marked as collected");
    } catch (error) {
      alert(error.response?.data?.error || "Collection update failed");
    }
  };

  const filteredFarmers = farmers.filter((farmer) => {
    const search = searchTerm.toLowerCase();

    return (
      farmer.name?.toLowerCase().includes(search) ||
      farmer.id_number?.toLowerCase().includes(search) ||
      farmer.contact?.toLowerCase().includes(search) ||
      farmer.location?.toLowerCase().includes(search) ||
      farmer.submitted_mpesa_code?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="container-fluid px-5 py-4 bg-light min-vh-100">
      <div className="mb-5">
        <h1 className="display-6 fw-bold text-warning">
          🌻 Sunflower Farmers Management System
        </h1>
        <p className="text-secondary">
          Registration • Verification • Seed Allocation • Progress Tracking
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card shadow border-0 text-center h-100">
            <div className="card-body">
              <h6>Total Farmers</h6>
              <h2 className="text-primary">{stats.total_farmers}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 text-center h-100">
            <div className="card-body">
              <h6>Verified Farmers</h6>
              <h2 className="text-success">{stats.verified_farmers}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 text-center h-100">
            <div className="card-body">
              <h6>Pending Verification</h6>
              <h2 className="text-warning">{stats.pending_verification}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 text-center h-100">
            <div className="card-body">
              <h6>Paid Farmers</h6>
              <h2 className="text-success">{stats.paid_farmers}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 text-center h-100">
            <div className="card-body">
              <h6>Unpaid Farmers</h6>
              <h2 className="text-danger">{stats.unpaid_farmers}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 text-center h-100">
            <div className="card-body">
              <h6>Seed Allocations</h6>
              <h2 className="text-info">{stats.seed_allocations}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 text-center h-100">
            <div className="card-body">
              <h6>Seeds Allocated</h6>
              <h2 className="text-success">{stats.seeds_allocated}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 text-center h-100">
            <div className="card-body">
              <h6>Seeds Collected</h6>
              <h2 className="text-primary">{stats.seeds_collected}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow border-0 text-center h-100">
            <div className="card-body">
              <h6>Total Revenue</h6>
              <h2 className="text-primary">
                KES {Number(stats.total_revenue || 0).toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow border-0 text-center h-100">
            <div className="card-body">
              <h6>Pending Collection</h6>
              <h2 className="text-warning">{stats.pending_collection}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-lg border-0 mb-5">
        <div className="card-header bg-white">
          <h4 className="mb-0">Farmer Registration</h4>
        </div>

        <div className="card-body">
          <form onSubmit={registerFarmer}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">ID Number</label>
                <input
                  className="form-control"
                  name="id_number"
                  value={form.id_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Contact</label>
                <input
                  className="form-control"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Location</label>
                <input
                  className="form-control"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
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

              <div className="col-md-4 mb-3">
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

              <div className="col-md-4 mb-3">
                <label className="form-label">Registration Fee</label>
                <input
                  type="number"
                  className="form-control"
                  value="1000"
                  readOnly
                />
              </div>
            </div>

            <button className="btn btn-success btn-lg">
              Register Farmer
            </button>
          </form>
        </div>
      </div>

      <div className="card shadow-lg border-0">
        <div className="card-header bg-white">
          <h4 className="mb-0">Registered Farmers</h4>
        </div>

        <div className="px-3 pt-3">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search by name, ID number, phone, location, or M-Pesa code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <p className="text-muted mt-2">
            Showing {filteredFarmers.length} farmer(s)
          </p>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>View</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>ID Number</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Farm Size</th>
                  <th>Payment</th>
                  <th>M-Pesa Code</th>
                  <th>Verification</th>
                  <th>Seed Status</th>
                  <th>Collection</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredFarmers.map((farmer) => {
                  const allocation = getAllocation(farmer.ID);

                  return (
                    <tr key={farmer.ID}>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm me-2 mb-1"
                          onClick={() =>
                            setSelectedFarmer({
                              ...farmer,
                              allocation,
                            })
                          }
                        >
                          View
                        </button>

                        <button
                          className="btn btn-outline-warning btn-sm mb-1"
                          onClick={() => setEditingFarmer(farmer)}
                        >
                          Edit
                        </button>
                      </td>

                      <td>{farmer.ID}</td>
                      <td>{farmer.name}</td>
                      <td>{farmer.id_number}</td>
                      <td>{farmer.contact || "-"}</td>
                      <td>{farmer.location}</td>
                      <td>{farmer.farm_size}</td>

                      <td>
                        <span
                          className={`badge ${
                            farmer.payment_status === "Paid"
                              ? "bg-success"
                              : farmer.payment_status ===
                                "Pending Confirmation"
                              ? "bg-info text-dark"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {farmer.payment_status || "Pending"}
                        </span>
                      </td>

                      <td>
                        {farmer.submitted_mpesa_code ? (
                          <span className="badge bg-dark">
                            {farmer.submitted_mpesa_code}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            farmer.verification_status === "Verified"
                              ? "bg-success"
                              : farmer.verification_status === "Rejected"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {farmer.verification_status || "Not Verified"}
                        </span>
                      </td>

                      <td>
                        {allocation ? (
                          <span className="badge bg-success">
                            {allocation.status || "Allocated"} (
                            {allocation.bags_allocated} bags)
                          </span>
                        ) : (
                          <span className="badge bg-secondary">
                            Not Allocated
                          </span>
                        )}
                      </td>

                      <td>
                        {allocation ? (
                          <span
                            className={`badge ${
                              allocation.collection_status === "Collected"
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {allocation.collection_status || "Pending"}
                          </span>
                        ) : (
                          <span className="badge bg-secondary">
                            Not Started
                          </span>
                        )}
                      </td>

                      <td>
                        {farmer.payment_status === "Pending Confirmation" &&
                          farmer.submitted_mpesa_code && (
                            <button
                              className="btn btn-success btn-sm me-2 mb-1"
                              onClick={() => approvePayment(farmer.ID)}
                            >
                              Approve Payment
                            </button>
                          )}

                        {farmer.payment_status !== "Paid" &&
                          farmer.payment_status !== "Pending Confirmation" && (
                            <button
                              className="btn btn-warning btn-sm me-2 mb-1"
                              onClick={() => markPaid(farmer.ID)}
                            >
                              Mark Paid
                            </button>
                          )}

                        {farmer.verification_status === "Verified" ? (
                          <span className="badge bg-success me-2 mb-1">
                            Verified
                          </span>
                        ) : farmer.verification_status === "Rejected" ? (
                          <span className="badge bg-danger me-2 mb-1">
                            Rejected
                          </span>
                        ) : (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2 mb-1"
                              onClick={() => verifyFarmer(farmer.ID)}
                            >
                              Verify
                            </button>

                            <button
                              className="btn btn-danger btn-sm me-2 mb-1"
                              onClick={() => rejectFarmer(farmer.ID)}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {farmer.payment_status === "Paid" &&
                          farmer.verification_status === "Verified" &&
                          !allocation && (
                            <button
  className="btn btn-info btn-sm me-2 mb-1"
  onClick={() => {
    setSelectedFarmer(farmer);
    setShowAllocationForm(true);
  }}
>
  Allocate Seeds
</button>
                          )}

                        {allocation &&
                          allocation.collection_status !== "Collected" && (
                            <button
                              className="btn btn-primary btn-sm mb-1"
                              onClick={() => markCollected(allocation.ID)}
                            >
                              Mark Collected
                            </button>
                          )}
                      </td>
                    </tr>
                  );
                })}

                {filteredFarmers.length === 0 && (
                  <tr>
                    <td colSpan="13" className="text-center text-muted">
                      No farmers registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedFarmer && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  Farmer Profile: {selectedFarmer.name}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedFarmer(null)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h5>Personal Information</h5>
                    <p>
                      <strong>Name:</strong> {selectedFarmer.name}
                    </p>
                    <p>
                      <strong>ID Number:</strong> {selectedFarmer.id_number}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedFarmer.contact || "-"}
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedFarmer.location}
                    </p>
                    <p>
                      <strong>Age:</strong> {selectedFarmer.age}
                    </p>
                    <p>
                      <strong>Farm Size:</strong> {selectedFarmer.farm_size}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <h5>Status Information</h5>

                    <p>
                      <strong>Payment:</strong>{" "}
                      <span
                        className={`badge ${
                          selectedFarmer.payment_status === "Paid"
                            ? "bg-success"
                            : selectedFarmer.payment_status ===
                              "Pending Confirmation"
                            ? "bg-info text-dark"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {selectedFarmer.payment_status || "Pending"}
                      </span>
                    </p>

                    <p>
                      <strong>Submitted M-Pesa Code:</strong>{" "}
                      {selectedFarmer.submitted_mpesa_code || "Not submitted"}
                    </p>

                    <p>
                      <strong>Verification:</strong>{" "}
                      <span
                        className={`badge ${
                          selectedFarmer.verification_status === "Verified"
                            ? "bg-success"
                            : selectedFarmer.verification_status === "Rejected"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {selectedFarmer.verification_status || "Not Verified"}
                      </span>
                    </p>

                    <p>
                      <strong>Seed Status:</strong>{" "}
                      {selectedFarmer.allocation ? (
                        <span className="badge bg-success">
                          {selectedFarmer.allocation.status || "Allocated"}
                        </span>
                      ) : (
                        <span className="badge bg-secondary">
                          Not Allocated
                        </span>
                      )}
                    </p>

                    <p>
                      <strong>Bags Allocated:</strong>{" "}
                      {selectedFarmer.allocation?.bags_allocated || 0}
                    </p>

                    <p>
                      <strong>Collection:</strong>{" "}
                      {selectedFarmer.allocation ? (
                        <span
                          className={`badge ${
                            selectedFarmer.allocation.collection_status ===
                            "Collected"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {selectedFarmer.allocation.collection_status ||
                            "Pending"}
                        </span>
                      ) : (
                        <span className="badge bg-secondary">Not Started</span>
                      )}
                    </p>

                    <p>
                      <strong>M-Pesa Receipt:</strong>{" "}
                      {selectedFarmer.mpesa_receipt || "Not available"}
                    </p>

                    <p>
                      <strong>Transaction ID:</strong>{" "}
                      {selectedFarmer.transaction_id || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                {selectedFarmer.payment_status === "Pending Confirmation" &&
                  selectedFarmer.submitted_mpesa_code && (
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        approvePayment(selectedFarmer.ID);
                        setSelectedFarmer(null);
                      }}
                    >
                      Approve Payment
                    </button>
                  )}

                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedFarmer(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

            {editingFarmer && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={updateFarmer}>
                {/* keep your existing edit modal content here */}
              </form>
            </div>
          </div>
        </div>
      )}

      {showAllocationForm && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title">
                  Allocate Seeds - {selectedFarmer?.name || ""}
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setShowAllocationForm(false)}
                ></button>
              </div>

              <div className="modal-body">
                <label className="form-label">Number of Bags</label>
                <input
                  type="number"
                  className="form-control mb-3"
                  value={allocationData.bags_allocated}
                  onChange={(e) =>
                    setAllocationData({
                      ...allocationData,
                      bags_allocated: e.target.value,
                    })
                  }
                />

                <label className="form-label">Collection Center</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  value={allocationData.collection_center}
                  onChange={(e) =>
                    setAllocationData({
                      ...allocationData,
                      collection_center: e.target.value,
                    })
                  }
                />

                <label className="form-label">Collection Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={allocationData.collection_date}
                  onChange={(e) =>
                    setAllocationData({
                      ...allocationData,
                      collection_date: e.target.value,
                    })
                  }
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAllocationForm(false)}
                >
                  Cancel
                </button>

                <button className="btn btn-info" onClick={allocateSeeds}>
                  Allocate Seeds
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
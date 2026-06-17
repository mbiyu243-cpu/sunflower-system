import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function SeedAllocation() {
  const [farmers, setFarmers] = useState([]);
  const [allocations, setAllocations] = useState([]);

  const fetchFarmers = async () => {
    try {
      const res = await axios.get(`${API_URL}/farmers`);
      setFarmers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllocations = async () => {
    try {
      const res = await axios.get(`${API_URL}/seed-allocations`);
      setAllocations(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFarmers();
    fetchAllocations();
  }, []);

  const getAllocation = (farmerId) => {
    return allocations.find((allocation) => allocation.farmer_id === farmerId);
  };

  const allocateSeeds = async (id, farmSize) => {
    try {
      await axios.post(`${API_URL}/seed-allocations`, {
        farmer_id: id,
        bags_allocated: farmSize * 2,
      });

      alert("Seeds allocated successfully");
      fetchAllocations();
    } catch (error) {
      alert("Allocation failed");
    }
  };

  const markCollected = async (allocationId) => {
    try {
      await axios.put(
        `${API_URL}/seed-allocations/${allocationId}/collect`
      );

      alert("Seeds marked as collected");
      fetchAllocations();
    } catch (error) {
      alert("Failed to mark seeds as collected");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="fw-bold text-success mb-4">
        🌱 Seed Allocation Management
      </h1>

      <div className="card shadow">
        <div className="card-header">
          <h4>Eligible Farmers</h4>
        </div>

        <div className="card-body">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Farm Size</th>
                <th>Payment</th>
                <th>Verification</th>
                <th>Bags Eligible</th>
                <th>Allocation Status</th>
                <th>Collection Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {farmers.map((farmer) => {
                const allocation = getAllocation(farmer.ID);

                return (
                  <tr key={farmer.ID}>
                    <td>{farmer.name}</td>
                    <td>{farmer.location}</td>
                    <td>{farmer.farm_size}</td>
                    <td>{farmer.payment_status}</td>
                    <td>{farmer.verification_status || "Not Verified"}</td>
                    <td>{farmer.farm_size * 2}</td>

                    <td>
                      {allocation ? (
                        <span className="badge bg-success">
                          {allocation.status || "Allocated"}
                        </span>
                      ) : (
                        <span className="badge bg-secondary">
                          Pending
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
                          Not Allocated
                        </span>
                      )}
                    </td>

                    <td>
                      {farmer.payment_status === "Paid" &&
                      farmer.verification_status === "Verified" ? (
                        allocation ? (
                          allocation.collection_status === "Collected" ? (
                            <span className="badge bg-success">
                              Completed
                            </span>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => markCollected(allocation.ID)}
                            >
                              Mark Collected
                            </button>
                          )
                        ) : (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              allocateSeeds(farmer.ID, farmer.farm_size)
                            }
                          >
                            Allocate Seeds
                          </button>
                        )
                      ) : (
                        <span className="badge bg-secondary">
                          Not Eligible
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SeedAllocation;
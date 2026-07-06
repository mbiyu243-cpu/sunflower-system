import { useState } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

const API_URL = import.meta.env.VITE_API_URL;

function SeedCollectionScanner() {
  const [allocation, setAllocation] = useState(null);
  const [error, setError] = useState("");

  const startScanner = () => {
    setError("");

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      async (decodedText) => {
        await scanner.clear();

        const allocationId = decodedText.replace("ALLOC:", "");

        try {
          const res = await axios.get(
            `${API_URL}/seed-allocations/${allocationId}/details`
          );

          setAllocation(res.data);
        } catch (err) {
          setError(err.response?.data?.error || "Invalid QR code");
        }
      },
      () => {}
    );
  };

  const markCollected = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

await axios.put(
  `${API_URL}/seed-allocations/${allocation.allocation_id}/collect`,
  {
    collected_by: user?.name || "Collection Officer",
  }
);

      alert("Seeds marked as collected");
      const res = await axios.get(
  `${API_URL}/seed-allocations/${allocation.allocation_id}/details`
);

setAllocation(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to mark collected");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-success text-white text-center">
          <h3>QR Seed Collection Scanner</h3>
        </div>

        <div className="card-body text-center">
          <button className="btn btn-success mb-3" onClick={startScanner}>
            Start Scanner
          </button>

          <div id="qr-reader" className="mx-auto" style={{ maxWidth: "400px" }} />

          {error && <div className="alert alert-danger mt-3">{error}</div>}

          {allocation && (
            <div className="card mt-4 text-start">
              <div className="card-body">
                <h4>Farmer Details</h4>

                <p><strong>Name:</strong> {allocation.name}</p>
                <p><strong>ID Number:</strong> {allocation.id_number}</p>
                <p><strong>Phone:</strong> {allocation.contact}</p>
                <p><strong>Location:</strong> {allocation.location}</p>

                <hr />

                <p><strong>Bags Allocated:</strong> {allocation.bags_allocated}</p>
                <p><strong>Collection Center:</strong> {allocation.collection_center}</p>
                <p><strong>Collection Date:</strong> {allocation.collection_date}</p>
                <p><strong>Payment Status:</strong> {allocation.payment_status}</p>
                <p><strong>Verification Status:</strong> {allocation.verification_status}</p>
                <p><strong>Collection Status:</strong> {allocation.collection_status}</p>
                {allocation.collection_status === "Collected" && (
  <>
    <p>
      <strong>Collected By:</strong>{" "}
      {allocation.collected_by || "Not recorded"}
    </p>

    <p>
      <strong>Collected At:</strong>{" "}
      {allocation.collected_at || "Not recorded"}
    </p>
  </>
)}

                {allocation.collection_status === "Collected" ? (
                  <div className="alert alert-success">
                    Seeds already collected.
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={markCollected}>
                    Confirm Seed Collection
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeedCollectionScanner;
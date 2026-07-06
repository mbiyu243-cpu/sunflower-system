import { Link } from "react-router-dom";

function CollectionOfficerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0 mb-4">
        <div className="card-header bg-success text-white text-center">
          <h3>🌻 Collection Officer Dashboard</h3>
        </div>

        <div className="card-body text-center">
          <h4>Welcome, {user?.name}</h4>
          <p className="text-muted">
            Scan farmer QR codes and confirm seed collection.
          </p>

          <Link
            to="/officer/seed-collection"
            className="btn btn-success btn-lg"
          >
            Open QR Scanner
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CollectionOfficerDashboard;
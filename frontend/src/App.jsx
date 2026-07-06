import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import FarmerRegister from "./pages/FarmerRegister";
import SeedAllocation from "./pages/SeedAllocation";
import FarmerStatus from "./pages/FarmerStatus";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminChangePassword from "./pages/AdminChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import SeedCollectionScanner from "./pages/SeedCollectionScanner";
import CollectionOfficerDashboard from "./pages/CollectionOfficerDashboard";

function AppContent() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success px-4">
        <Link className="navbar-brand fw-bold" to="/">
          🌻 Sunflower System
        </Link>

        <div className="ms-auto d-flex gap-2">
          {!user && (
            <>
              <Link className="btn btn-light btn-sm" to="/register">
                Farmer Register
              </Link>

              <Link className="btn btn-outline-light btn-sm" to="/farmer-status">
                Check Status
              </Link>

              <Link className="btn btn-dark btn-sm" to="/login">
                Login
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link className="btn btn-warning btn-sm" to="/admin">
                Admin Dashboard
              </Link>

              <Link className="btn btn-info btn-sm" to="/admin/seed-allocation">
                Seed Allocation
              </Link>

              <Link className="btn btn-outline-light btn-sm" to="/admin/change-password">
  Change Password
</Link>

              <button className="btn btn-dark btn-sm" onClick={logout}>
                Logout
              </button>
            </>
          )}

          {user?.role === "collection_officer" && (
  <>
    <Link className="btn btn-outline-light btn-sm" to="/officer/dashboard">
      Officer Dashboard
    </Link>

    <Link className="btn btn-outline-light btn-sm" to="/officer/seed-collection">
      Seed Collection
    </Link>

    <button className="btn btn-dark btn-sm" onClick={logout}>
      Logout
    </button>
  </>
)}

          {user?.role === "farmer" && (
            <>
              <Link className="btn btn-light btn-sm" to="/farmer-dashboard">
                Farmer Dashboard
              </Link>

              <button className="btn btn-dark btn-sm" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<FarmerRegister />} />
        <Route path="/register" element={<FarmerRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
        <Route
  path="/officer/seed-collection"
  element={
    <ProtectedRoute allowedRole="collection_officer">
      <SeedCollectionScanner />
    </ProtectedRoute>
  }
/>
        <Route
  path="/admin/seed-allocation"
  element={
    <ProtectedRoute allowedRole="admin">
      <SeedAllocation />
    </ProtectedRoute>
  }
/>
        <Route path="/farmer-status" element={<FarmerStatus />} />
        <Route path="/login" element={<Login />} />
        <Route
  path="/admin/change-password"
  element={
    <ProtectedRoute allowedRole="admin">
      <AdminChangePassword />
    </ProtectedRoute>
  }
/>
        <Route
  path="/farmer-dashboard"
  element={
    <ProtectedRoute allowedRole="farmer">
      <FarmerDashboard />
    </ProtectedRoute>
  }
  />

  <Route
  path="/officer/dashboard"
  element={
    <ProtectedRoute allowedRole="collection_officer">
      <CollectionOfficerDashboard />
    </ProtectedRoute>
  }
/>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
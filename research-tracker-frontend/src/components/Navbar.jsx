import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const authenticated = isAuthenticated();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Research Tracker
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {!authenticated && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
              </>
            )}
            {authenticated && role === "researcher" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/papers">Papers</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/grants">Grants</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/reports">Reports</Link></li>
              </>
            )}
            {authenticated && role === "admin" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/admin/dashboard">Admin Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/papers">Manage Papers</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/grants">Manage Grants</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/reports">Manage Reports</Link></li>
              </>
            )}
            {authenticated && role === "reviewer" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/reviewer/papers">My Reviews</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/reviewer/submit">Submit Review</Link></li>
              </>
            )}
            {authenticated && role === "funding_authority" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/funding/grants">Grants</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/funding/reports">Reports</Link></li>
              </>
            )}
          </ul>

          <div className="d-flex gap-2 align-items-center">
            {!authenticated ? (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
                <Link className="btn btn-primary btn-sm" to="/register">Register</Link>
              </>
            ) : (
              <>
                <span className="text-light small">Hi, {user?.name || "User"}</span>
                <button className="btn btn-outline-warning btn-sm" onClick={logout} type="button">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

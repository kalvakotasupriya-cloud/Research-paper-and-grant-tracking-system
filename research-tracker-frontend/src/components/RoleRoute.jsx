import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

const RoleRoute = ({ allowedRoles = [], children }) => {
  const { role } = useAuth();

  return (
    <ProtectedRoute>
      {allowedRoles.includes(role) ? children : <Navigate to="/unauthorized" replace />}
    </ProtectedRoute>
  );
};

export default RoleRoute;

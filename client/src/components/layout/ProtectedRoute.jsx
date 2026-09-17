import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "../ui/ui";

export function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

export function RoleRoute({ roles, children }) {
  const { isLoggedIn, userType, profile } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  // profile may still be hydrating; show a spinner instead of bouncing
  if (profile === null) {
    return <Spinner />;
  }
  if (!roles.includes(userType)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

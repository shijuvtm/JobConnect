import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("access");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role && userRole && userRole !== role) {
    return <Navigate to={userRole === "employer" ? "/employer/dashboard" : "/jobs"} replace />;
  }

  return children;
}

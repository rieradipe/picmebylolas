import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ allow = [], children }) {
  const { user, isAllowed } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (!isAllowed(allow)) return <Navigate to="/" replace />;

  return children;
}

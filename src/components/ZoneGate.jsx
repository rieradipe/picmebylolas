import { Navigate, useLocation } from "react-router-dom";

const ZONE_KEY = "pm:order:zone";

export default function ZoneGate({ children }) {
  const zone = localStorage.getItem(ZONE_KEY);
  const loc = useLocation();

  if (!zone) {
    return <Navigate to="/qr" replace state={{ from: loc.pathname }} />;
  }
  return children;
}

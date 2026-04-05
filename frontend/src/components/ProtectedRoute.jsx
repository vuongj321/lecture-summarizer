import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp >= Date.now() / 1000;
  } catch {
    return false;
  }
}

function ProtectedRoute({ children }) {
  if (!isTokenValid()) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;

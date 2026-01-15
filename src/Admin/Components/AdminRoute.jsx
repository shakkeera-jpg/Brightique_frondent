import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/UserContext";

export default function AdminRoute({ children }) {
  const { user, Authloading } = useContext(AuthContext);

  if (Authloading) return null;

  if (!user || !user.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

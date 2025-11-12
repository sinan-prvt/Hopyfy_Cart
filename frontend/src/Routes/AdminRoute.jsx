import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || (!user.is_staff && !user.is_superuser)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;
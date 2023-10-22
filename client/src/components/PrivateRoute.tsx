import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/AuthContext";

const PrivateRoute = () => {
  const { auth } = useAuth();
  const location = useLocation();
  return auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;

// src/routes/ProtectedRoute.tsx
import Cookies from "js-cookie";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const isLoggedIn = (): boolean => {
  const token = Cookies.get("authToken");
  return Boolean(token);
};

const ProtectedRoute = (): JSX.Element => {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

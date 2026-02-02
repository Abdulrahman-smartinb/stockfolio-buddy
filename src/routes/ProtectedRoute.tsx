// src/routes/ProtectedRoute.tsx
import { isLoggedIn } from "@/hooks/helpers";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = (): JSX.Element => {
  const location = useLocation();
  console.log(isLoggedIn());
  if (!isLoggedIn()) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

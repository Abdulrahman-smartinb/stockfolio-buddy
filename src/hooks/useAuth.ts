import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logout as logoutAction, setUser } from "@/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const logout = () => {
    dispatch(logoutAction());
  };

  const login = (userData: { id: string; name: string; email: string }) => {
    dispatch(setUser(userData));
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("authToken", `token-${Date.now()}`);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    login,
  };
};

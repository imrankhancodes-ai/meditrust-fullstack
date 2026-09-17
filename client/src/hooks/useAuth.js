import { useSelector, useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../redux/slices/authSlice";
import { clearLocal } from "../redux/slices/cartSlice";

export default function useAuth() {
  const { token, user, profile } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const qc = useQueryClient();

  const userType = profile?.userType || "USER";

  const doLogout = () => {
    dispatch(logout());
    dispatch(clearLocal());
    qc.clear();
  };

  return {
    token,
    user,
    profile,
    userType,
    isLoggedIn: !!token,
    isAdmin: userType === "ADMIN",
    isDoctor: userType === "DOCTOR",
    isPathologist: userType === "PATHOLOGIST",
    doLogout,
  };
}

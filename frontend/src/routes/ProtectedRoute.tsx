import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { DefaultCustomProps } from "../lib/constants";
import type { RootState } from "../state/store";
import SpinnerPrimary from "../components/spinner/SpinnerPrimary";

export default function ProtectedRoute({ children }: DefaultCustomProps) {
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

  if (isLoading) {
    return <SpinnerPrimary />;
  }

  // redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

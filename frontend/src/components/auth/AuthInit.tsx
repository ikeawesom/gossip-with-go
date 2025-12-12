import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../state/store";
import { checkAuth } from "../../state/auth/authSlice";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // only check auth if we think user is authenticated (from persisted state)
    if (isAuthenticated) {
      dispatch(checkAuth());
    }
  }, []);

  return <>{children} </>;
}

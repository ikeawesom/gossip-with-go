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
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("checking auth: ");
      dispatch(checkAuth());
    } else {
      console.log("authenticated as:", user?.username);
    }
  }, [isAuthenticated]);

  return <>{children} </>;
}

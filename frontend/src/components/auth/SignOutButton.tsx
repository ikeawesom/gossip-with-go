import { authApi } from "../../api/auth.api";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../state/store";
import { checkAuth } from "../../state/auth/authSlice";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { defaultError } from "../../lib/constants";
import type { ApiError } from "../../types/auth";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSignout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
      dispatch(checkAuth());
      toast.success("Signed out successfully");
      window.location.reload();
    } catch (err: any) {
      // get full axios error
      const axiosError = err as AxiosError<ApiError>;
      console.log("[SIGN OUT ERROR]:", axiosError.response?.data);

      // toast error or default error
      toast.error(axiosError.response?.data?.message || defaultError.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <button
      disabled={loading}
      className={twMerge(
        "font-bold w-full flex items-center text-red-light justify-start gap-3 rounded-md hover:bg-primary/10 duration-150 p-2 text-start",
        loading ? "" : "cursor-pointer"
      )}
      onClick={handleSignout}
    >
      <img src="/icons/icon_logout.svg" width={20} height={20} />
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}

import { authApi } from "../../api/auth.api";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../state/store";
import { checkAuth } from "../../state/auth/authSlice";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSignout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
      dispatch(checkAuth());
      console.log("Signed out");
      // window.location.reload();
    } catch (err: any) {
      console.log(err);
      toast.error("Could not sign out. Please try again later.");
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

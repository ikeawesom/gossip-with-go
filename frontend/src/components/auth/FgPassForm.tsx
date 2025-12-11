import AuthForm from "./AuthForm";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../state/store";
import { Link } from "react-router-dom";
import { fgPassAsync, setUsername } from "../../state/auth/fgPassSlice";
import PrimaryButton from "../utils/PrimaryButton";
import { useEffect } from "react";
import { toast } from "sonner";
import { maskEmail } from "../../lib/helpers";
import { twMerge } from "tailwind-merge";

export default function FgPassForm() {
  const { isLoading, username, error, email } = useSelector(
    (state: RootState) => state.fgPassForm
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (error) {
      toast.error(`ERROR: ${error.message}`);
    }
  }, [error]);

  return (
    <AuthForm>
      {email ? (
        <>
          <h1 className="text-center">
            Reset password link sent to{" "}
            <span className="text-primary">{maskEmail(email)}</span>
          </h1>
          <p className="text-center w-full">
            Didn't get your email?{" "}
            <span
              onClick={() => dispatch(fgPassAsync({ username }))}
              className={twMerge(
                "text-sm text-primary duration-150",
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:opacity-70 cursor-pointer"
              )}
            >
              {isLoading ? "Sending..." : "Resend"}
            </span>
          </p>
        </>
      ) : (
        <>
          <div className="w-full flex flex-col gap-3 items-start justify-start">
            <input
              onChange={(e) => dispatch(setUsername(e.target.value))}
              type="text"
              placeholder="Enter your username"
              required
            />
            <p className="ml-1">
              Got your password?{" "}
              <Link
                to="/auth/login"
                className="text-sm text-primary hover:opacity-70 duration-150"
              >
                Sign In
              </Link>
            </p>
          </div>

          <PrimaryButton
            type="button"
            className="w-full mt-3"
            disabled={username === "" || isLoading}
            onClick={() => dispatch(fgPassAsync({ username }))}
          >
            {isLoading ? (
              <div className="grid place-items-center">
                <img
                  className="animate-spin"
                  src="/utils/spinner_white.png"
                  alt="Loading"
                  height={24}
                  width={24}
                />
              </div>
            ) : (
              "Reset Password"
            )}
          </PrimaryButton>
        </>
      )}
    </AuthForm>
  );
}

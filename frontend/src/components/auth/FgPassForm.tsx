import AuthForm from "./AuthForm";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../state/store";
import { Link } from "react-router-dom";
import PrimaryButton from "../utils/PrimaryButton";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { clearError, sendPasswordResetEmail } from "../../state/auth/authSlice";
import type { ResponseType } from "../../types/res";
import { toast } from "sonner";

export default function FgPassForm() {
  const [username, setUsername] = useState("");
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const { payload } = await dispatch(sendPasswordResetEmail({ username }));
    const res = payload as ResponseType;
    if (!res.error) {
      setSuccess(true);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit}>
      {success ? (
        <>
          <h1 className="text-center">
            If <span className="text-primary">{username}</span> exists, an email
            has been sent.
          </h1>
          <p className="text-center w-full">
            Didn't get your email?{" "}
            <span
              onClick={handleSubmit}
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
              onChange={(e) => setUsername(e.target.value)}
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
            type="submit"
            className="w-full mt-3"
            disabled={username === "" || isLoading}
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

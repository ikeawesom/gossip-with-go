import { Link } from "react-router-dom";
import PrimaryButton from "../utils/PrimaryButton";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../state/store";
import { useState } from "react";
import { toast } from "sonner";
import AuthForm from "./AuthForm";
import type { SignupCredentials } from "../../types/auth";
import { clearError, signupUser } from "../../state/auth/authSlice";
import useAuth from "../../hooks/useAuth";
import { twMerge } from "tailwind-merge";
import SpinnerSecondary from "../spinner/SpinnerSecondary";
import { defaultError } from "../../lib/constants";

export default function RegisterForm() {
  const [registerDetails, setRegisterDetails] = useState<SignupCredentials>({
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  });
  const { confirm_password, email, password, username } = registerDetails;
  const [success, setSuccess] = useState(false);
  const [sent, setSent] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useAuth();

  const empty_password = password === "" && confirm_password === "";
  const password_mismatch = password !== confirm_password;
  const disabled = isLoading || password_mismatch || empty_password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sent) {
      setSuccess(false);
    }
    dispatch(clearError());

    const result = await dispatch(
      signupUser({
        confirm_password,
        email,
        password,
        username,
      })
    );

    if (signupUser.fulfilled.match(result)) {
      setSuccess(true);
      setSent(true);
      toast.success("Verification email sent!");
    } else {
      const error = result.payload as string;
      if (error.includes("registered")) {
        toast.error(
          "Email has already been registered. Try signing in instead!"
        );
      } else if (error.includes("username")) {
        toast.error("Username has already been taken.");
      } else {
        console.log("[SIGN UP ERROR]", error);
        toast.error(defaultError.message);
      }
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit}>
      {success ? (
        <>
          <div className="w-full">
            <h3 className="text-xl text-center mb-2 smart-wrap custom">
              Email verification link sent to{" "}
              <span className="text-primary font-bold">{email}</span>
            </h3>
            <p className="text-center">
              Please verify your email before creating an account.
            </p>
            <p className="text-center">
              Didn't get your email?{" "}
              <span
                onClick={handleSubmit}
                className={twMerge(
                  "text-sm text-primary duration-150",
                  isLoading && sent
                    ? "cursor-not-allowed opacity-50"
                    : "hover:opacity-70 cursor-pointer"
                )}
              >
                {isLoading ? "Sending..." : "Resend"}
              </span>
            </p>
          </div>
        </>
      ) : (
        <>
          <input
            value={email}
            onChange={(e) =>
              setRegisterDetails({ ...registerDetails, email: e.target.value })
            }
            type="email"
            placeholder="Enter your email"
            required
          />
          <input
            value={username}
            onChange={(e) =>
              setRegisterDetails({
                ...registerDetails,
                username: e.target.value,
              })
            }
            type="text"
            placeholder="Enter a username"
            required
          />
          <input
            value={password}
            onChange={(e) =>
              setRegisterDetails({
                ...registerDetails,
                password: e.target.value,
              })
            }
            type="password"
            placeholder="Enter a password"
            required
          />
          <input
            value={confirm_password}
            onChange={(e) =>
              setRegisterDetails({
                ...registerDetails,
                confirm_password: e.target.value,
              })
            }
            type="password"
            placeholder="Confirm password"
            required
          />
          {password_mismatch && (
            <p className="ml-1 error">ERROR: Passwords do not match.</p>
          )}
          <p className="ml-1">
            Already a Gossiper?{" "}
            <Link
              to="/auth/login"
              className="text-sm text-primary hover:opacity-70 duration-150"
            >
              Sign In
            </Link>
          </p>

          <PrimaryButton
            type="submit"
            disabled={disabled}
            className="w-full mt-3"
          >
            {isLoading ? <SpinnerSecondary /> : "Get Started"}
          </PrimaryButton>
        </>
      )}
    </AuthForm>
  );
}

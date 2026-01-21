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
import useCheckPassword from "../../hooks/useCheckPassword";
import PasswordCriteriaList from "./PasswordCriteriaList";

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

  // username must be between 8 to 16 characters long
  const valid_username_length =
    registerDetails.username.length > 7 && registerDetails.username.length < 17;

  // username cannot have spacing
  const valid_username_char = registerDetails.username.split(" ").length === 1;

  const { valid_password } = useCheckPassword(password);

  const empty_password = password === "" && confirm_password === "";
  const password_mismatch = password !== confirm_password;

  // disable register button with following criterias
  const disabled =
    !valid_username_length ||
    !valid_username_char ||
    !valid_password ||
    isLoading ||
    password_mismatch ||
    empty_password;

  const [error, setError] = useState<{
    type: "username" | "email" | "password";
    message: string;
  }>();

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
      }),
    );

    if (signupUser.fulfilled.match(result)) {
      setSuccess(true);
      setSent(true);
      toast.success("Verification email sent!");
    } else {
      const error = result.payload as string;

      // set error messages based on payload error
      if (error.includes("registered")) {
        setError({
          type: "email",
          message: "Email has already been registered. Try signing in instead.",
        });
      } else if (error.includes("username")) {
        setError({
          type: "username",
          message: "Username has already been taken.",
        });
      } else {
        console.log("[SIGN UP ERROR]", error);

        // error is non-specific, send default error message
        toast.error(defaultError.message);
      }
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit}>
      {success ? (
        <>
          <div className="w-full">
            <h3 className="text-base text-center mb-2 smart-wrap custom">
              Email verification link sent to{" "}
              <span className="text-primary font-bold">{email}</span>
            </h3>
            <p className="text-center custom text-sm">
              Please verify your email before creating an account. Didn't get
              your email?{" "}
              <span
                onClick={handleSubmit}
                className={twMerge(
                  "text-sm text-primary duration-150",
                  isLoading && sent
                    ? "cursor-not-allowed opacity-50"
                    : "hover:opacity-70 cursor-pointer",
                )}
              >
                {isLoading ? "Sending..." : "Resend."}
              </span>
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="w-full flex flex-col items-start justify-start gap-1">
            <input
              value={email}
              onChange={(e) =>
                setRegisterDetails({
                  ...registerDetails,
                  email: e.target.value,
                })
              }
              type="email"
              placeholder="Enter your email"
              required
            />
            {error?.type === "email" && (
              <li className="text-xs md:text-sm list-disc ml-6 text-red">
                {error.message}
              </li>
            )}
          </div>
          <div className="w-full flex flex-col items-start justify-start gap-1">
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
            {username.length > 0 && (
              <ul className="mt-1 mb-2">
                {error?.type === "username" && (
                  <li className="text-red text-xs md:text-sm ml-6 list-disc mb-1">
                    {error.message}
                  </li>
                )}

                <li
                  className={twMerge(
                    "text-xs md:text-sm list-disc ml-6",
                    valid_username_length ? "text-green" : "text-red",
                  )}
                >
                  Must be at 8 to 16 characters long.
                </li>

                <li
                  className={twMerge(
                    "text-xs md:text-sm list-disc ml-6",
                    valid_username_char ? "text-green" : "text-red",
                  )}
                >
                  Must have no spacing.
                </li>
              </ul>
            )}
          </div>
          <div className="w-full flex flex-col items-start justify-start gap-1">
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
            {password.length > 0 && (
              <PasswordCriteriaList password={password} />
            )}
          </div>
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
            <p className="ml-1 custom text-red text-xs md:text-sm">
              Passwords do not match.
            </p>
          )}
          <p className="ml-1 custom text-sm mt-2">
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

import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { ApiError } from "../types/auth";
import { authApi } from "../api/auth.api";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const [count, setCount] = useState(3);

  useEffect(() => {
    if (status !== "success") return;

    const id = setInterval(() => {
      setCount((c) => (c > 0 ? c - 1 : c));
    }, 1000);

    return () => clearInterval(id); // cleanup on unmount or status change
  }, [status]);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setErrorMsg(
          "Invalid verification link. Please try again or request another link."
        );
        return;
      }

      try {
        await authApi.verifyEmail({ token });
        setStatus("success");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/auth/login");
          // toast.success(
          //   "You may now sign in using your username and password."
          // );
        }, 3000);
      } catch (error) {
        setStatus("error");
        const axiosError = error as AxiosError<ApiError>;
        console.error("Full error:", axiosError.response?.data);
        setErrorMsg(
          axiosError.response?.data?.message ||
            "An unexpected error occurred when verifiying your email. Please register again or try again later."
        );
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (status === "verifying") {
    return (
      <div className="flex items-center justify-center gap-2">
        <p>Verifying your email</p>
        <img
          className="animate-spin"
          src="/utils/spinner_primary.png"
          alt="Loading"
          height={18}
          width={18}
        />
      </div>
    );
  }

  if (status === "success") {
    return (
      <h4>
        Email verified successfully! Redirecting you in{" "}
        <span className="text-primary">{count}</span> seconds.
      </h4>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <p className="text-center">{errorMsg}</p>
        <p>
          Back to{" "}
          <Link
            className="text-sm text-primary hover:opacity-70 duration-150"
            to="/auth/register"
          >
            Sign Up
          </Link>
        </p>
      </div>
    );
  }
}

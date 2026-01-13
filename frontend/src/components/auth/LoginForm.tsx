import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../utils/PrimaryButton";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../state/store";
import { toast } from "sonner";
import { useState } from "react";
import AuthForm from "./AuthForm";
import { clearError, loginUser } from "../../state/auth/authSlice";
import useAuth from "../../hooks/useAuth";
import SpinnerSecondary from "../spinner/SpinnerSecondary";
import { defaultError } from "../../lib/constants";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { error, isLoading, prev_page } = useAuth();

  const disable = isLoading || password.length === 0 || username.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(loginUser({ username, password }));

    if (loginUser.fulfilled.match(result)) {
      navigate(prev_page, { replace: true });
    } else {
      if (!error || error.toLowerCase().includes("invalid")) {
        toast.error("Invalid username or password. Please try again.");
      } else if (error.toLowerCase().includes("verified")) {
        toast.info(error);
      } else {
        toast.error(defaultError.message);
        console.log("[LOGIN ERROR]", error);
      }
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        placeholder="Enter your username"
        required
      />
      <div className="w-full flex flex-col gap-3 items-start justify-start">
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your password"
          required
        />
        <Link
          to="/auth/forgot-password"
          className="text-sm ml-1 text-primary hover:opacity-70 duration-150"
        >
          Forgot password?
        </Link>
      </div>
      <p className="ml-1">
        New to Gossip Go?{" "}
        <Link
          to="/auth/register"
          className="text-sm text-primary hover:opacity-70 duration-150"
        >
          Sign Up
        </Link>
      </p>

      <PrimaryButton type="submit" className="w-full mt-3" disabled={disable}>
        {isLoading ? <SpinnerSecondary /> : "Login"}
      </PrimaryButton>
    </AuthForm>
  );
}

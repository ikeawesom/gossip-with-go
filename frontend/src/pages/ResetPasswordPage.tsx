import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import { toast } from "sonner";
import AuthForm from "../components/auth/AuthForm";
import PrimaryButton from "../components/utils/PrimaryButton";
import SpinnerSecondary from "../components/spinner/SpinnerSecondary";
import type { AxiosError } from "axios";
import { defaultError } from "../lib/constants";
import type { ApiError } from "../types/auth";
import useCheckPassword from "../hooks/useCheckPassword";
import PasswordCriteriaList from "../components/auth/PasswordCriteriaList";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [cfmPass, setCfmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const { valid_password } = useCheckPassword(password);
  const disable = loading || password !== cfmPass || !valid_password;

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        navigate("/auth/login");
        return;
      } else {
        try {
          const res = await authApi.checkResetToken(token);
          if (!res.success) {
            toast.error("Invalid or expired reset token.");
            navigate("/auth/forgot-password");
          }
        } catch (err: any) {
          toast.error("Invalid or expired reset token.");
          navigate("/auth/forgot-password");
        }
      }
    };
    checkToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!token) throw new Error("Missing reset token.");
      await authApi.resetPassword({
        token,
        confirm_password: cfmPass,
        new_password: password,
      });
      toast.success("Password reset successful. You can now log in.");
      navigate("/auth/login");
    } catch (err: any) {
      // get full axios error
      const axiosError = err as AxiosError<ApiError>;
      console.log("[EDIT PROFILE ERROR]:", axiosError.response?.data);

      // toast error or default error
      toast.error(axiosError.response?.data?.message || defaultError.message);
    }
    setLoading(false);
  };

  return (
    <AuthForm onSubmit={handleSubmit}>
      <div className="w-full flex flex-col items-start justify-start gap-1">
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter a new password"
          required
        />
        {password.length > 0 && <PasswordCriteriaList password={password} />}
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-1">
        <input
          value={cfmPass}
          onChange={(e) => setCfmPass(e.target.value)}
          type="password"
          placeholder="Confirm your password"
          required
        />
        {password !== cfmPass && (
          <p className="text-red custom text-xs ml-3 mt-1 mb-1">
            Passwords do not match.
          </p>
        )}
      </div>
      <PrimaryButton type="submit" className="w-full mt-3" disabled={disable}>
        {loading ? <SpinnerSecondary /> : "Reset Password"}
      </PrimaryButton>
    </AuthForm>
  );
}

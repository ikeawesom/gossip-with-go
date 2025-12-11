import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../utils/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../state/store";
import {
  setPassword,
  setUsername,
  loginAsync,
} from "../../state/auth/loginFormSlice";
import { toast } from "sonner";
import { useEffect } from "react";

export default function LoginForm() {
  const { isLoading, password, username, error, jwt_token } = useSelector(
    (state: RootState) => state.loginForm
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const disable = isLoading || password.length === 0 || username.length === 0;

  useEffect(() => {
    if (error) {
      toast.error(`ERROR: ${error.message}`);
    }

    if (jwt_token) {
      const { name } = jwt_token;
      toast.success(`Welcome home, ${name}!`);
      navigate("/");
    }
  }, [error, jwt_token]);

  return (
    <form className="w-full max-w-[600px] flex flex-col gap-2 items-start justify-center border-t border-gray-dark/20 pt-6 ">
      <input
        onChange={(e) => dispatch(setUsername(e.target.value))}
        type="text"
        placeholder="Enter your username"
        required
      />
      <div className="w-full flex flex-col gap-3 items-start justify-start">
        <input
          onChange={(e) => dispatch(setPassword(e.target.value))}
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

      <PrimaryButton
        className="w-full mt-3"
        disabled={disable}
        onClick={() => dispatch(loginAsync({ username, password }))}
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
          "Login"
        )}
      </PrimaryButton>
    </form>
  );
}

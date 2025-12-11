import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../utils/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../state/store";
import {
  setEmail,
  setFirstName,
  registerAsync,
  setLastName,
  setPassword,
  setPasswordCfm,
  setUsername,
} from "../../state/auth/registerFormSlice";
import Notice from "../utils/Notice";
import { useEffect } from "react";
import { toast } from "sonner";

export default function RegisterForm() {
  const {
    email,
    first_name,
    last_name,
    isLoading,
    password,
    passwordCfm,
    username,
    error,
    jwt_token,
  } = useSelector((state: RootState) => state.registerForm);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const empty_password = password === "" && passwordCfm === "";
  const password_mismatch = password !== passwordCfm;
  const disabled = isLoading || password_mismatch || empty_password;

  useEffect(() => {
    if (error) {
      toast.error(`ERROR: ${error.message}`);
    }

    if (jwt_token) {
      const { name } = jwt_token;
      toast.success(`Welcome to Gossip With Go, ${name}!`);
      navigate("/");
      // begin tutorial
    }
  }, [error, jwt_token]);

  return (
    <form className="w-full max-w-[600px] flex flex-col gap-2 items-start justify-center border-t border-gray-dark/20 pt-5">
      <input
        value={email}
        onChange={(e) => dispatch(setEmail(e.target.value))}
        type="email"
        placeholder="Enter your email"
        required
      />
      <div className="flex w-full items-center justify-center gap-2 pb-2">
        <input
          value={first_name}
          onChange={(e) => dispatch(setFirstName(e.target.value))}
          type="text"
          placeholder="First name"
        />
        <input
          value={last_name}
          onChange={(e) => dispatch(setLastName(e.target.value))}
          type="text"
          placeholder="Last name"
        />
      </div>
      <div className="border-t border-gray-dark/20 w-full flex flex-col gap-2 items-start justify-center pt-4">
        <input
          value={username}
          onChange={(e) => dispatch(setUsername(e.target.value))}
          type="text"
          placeholder="Enter a username"
          required
        />
        <input
          value={password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
          type="password"
          placeholder="Enter a password"
          required
        />
        <input
          value={passwordCfm}
          onChange={(e) => dispatch(setPasswordCfm(e.target.value))}
          type="password"
          placeholder="Confirm password"
          required
        />
      </div>
      <p className="ml-1">
        Already a Gossiper?{" "}
        <Link
          to="/auth/login"
          className="text-sm text-primary hover:opacity-70 duration-150"
        >
          Log In?
        </Link>
      </p>
      {password_mismatch && (
        <Notice type="warning">ERROR: Passwords do not match.</Notice>
      )}
      <PrimaryButton
        onClick={() =>
          dispatch(
            registerAsync({
              email,
              first_name,
              last_name,
              username,
              passwordCfm,
            })
          )
        }
        disabled={disabled}
        className="w-full mt-3"
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
          "Get Started"
        )}
      </PrimaryButton>
    </form>
  );
}

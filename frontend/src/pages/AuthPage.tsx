import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "../components/utils/Card";
import PrimaryButton from "../components/utils/PrimaryButton";

type AuthPageParams = { auth_option: string };

export default function AuthPage() {
  const { auth_option } = useParams<AuthPageParams>();
  const navigate = useNavigate();

  auth_option === "login"
    ? "Login Page"
    : auth_option === "register"
    ? "Sign Up Page"
    : auth_option === "forgot-password"
    ? "Forgot Password"
    : navigate("/invalid-page");

  return (
    <section className="w-full grid place-items-center p-12 h-screen from-primary/30 to-primary/5 bg-linear-145">
      <Card className="flex flex-col items-center justify-center gap-4">
        <h2>
          {auth_option === "login"
            ? "Login Page"
            : auth_option === "register"
            ? "Sign Up Page"
            : auth_option === "forgot-password"
            ? "Forgot Password"
            : ""}
        </h2>
        <form className="w-full max-w-[400px] flex flex-col gap-4 items-start justify-center border-t border-gray-dark/20 pt-6 ">
          <input type="text" placeholder="Enter your username" required />
          <div className="w-full flex flex-col gap-3 items-start justify-start">
            <input type="password" placeholder="Enter your password" required />
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
          <PrimaryButton className="w-full">Login</PrimaryButton>
        </form>
      </Card>
    </section>
  );
}

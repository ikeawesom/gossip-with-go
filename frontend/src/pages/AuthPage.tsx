import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/utils/Card";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import Logo from "../components/utils/Logo";
import FgPassForm from "../components/auth/FgPassForm";

type AuthPageParams = { auth_option: string };
const authTitles = {
  login: "Sign In",
  register: "Sign Up",
  "forgot-password": "Forgot Password",
} as { [key: string]: string };

export default function AuthPage() {
  const { auth_option } = useParams<AuthPageParams>();
  const navigate = useNavigate();

  if (
    auth_option !== "login" &&
    auth_option !== "register" &&
    auth_option !== "forgot-password"
  ) {
    navigate("/invalid-page");
  }

  return (
    <section className="w-full grid place-items-center p-12 h-screen from-primary/30 to-primary/5 bg-linear-145">
      <Card className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center gap-1">
          <Logo color link />
          <h2>{authTitles[auth_option ?? ""]}</h2>
        </div>
        {auth_option === "login" ? (
          <LoginForm />
        ) : auth_option === "register" ? (
          <RegisterForm />
        ) : (
          <FgPassForm />
        )}
      </Card>
    </section>
  );
}

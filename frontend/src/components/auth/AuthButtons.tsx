import SecondaryButton from "../utils/SecondaryButton";
import { useLocation, useNavigate } from "react-router-dom";
import PrimaryButton from "../utils/PrimaryButton";
import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";

export default function AuthButtons({ className }: DefaultCustomProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const curPage = location.pathname;

  return (
    <div
      className={twMerge(
        "bg-white/60 flex items-center justify-center gap-1 backdrop-blur-md border border-white/20 shadow-sm p-1 rounded-full",
        className
      )}
    >
      <SecondaryButton
        className={twMerge("home-sign-in", className)}
        onClick={() =>
          navigate("/auth/login", {
            state: { prev_page: curPage },
          })
        }
      >
        Sign In
      </SecondaryButton>
      <PrimaryButton
        className={twMerge("home-sign-up", className)}
        onClick={() =>
          navigate("/auth/register", {
            state: { prev_page: curPage },
          })
        }
      >
        Get Started
      </PrimaryButton>
    </div>
  );
}

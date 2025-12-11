import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";

export default function AuthForm({ children, className }: DefaultCustomProps) {
  return (
    <form
      className={twMerge(
        "w-full max-w-[600px] flex flex-col gap-2 items-start justify-center border-t border-gray-dark/20 pt-5",
        className
      )}
    >
      {children}
    </form>
  );
}

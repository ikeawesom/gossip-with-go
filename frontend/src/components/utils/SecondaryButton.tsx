import { twMerge } from "tailwind-merge";
import type { ButtonProps } from "./PrimaryButton";

export default function SecondaryButton({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        "text-primary whitespace-nowrap cursor-pointer border px-4 py-2 text-sm font-bold rounded-full shadow-sm border-white from-white to-white/10 bg-linear-to-br hover:to-primary/15 transition-colors duration-300",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

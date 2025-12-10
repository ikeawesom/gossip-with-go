import { twMerge } from "tailwind-merge";
import PrimaryButton from "./PrimaryButton";
import type { ButtonProps } from "./PrimaryButton";

export default function SecondaryButton({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <PrimaryButton
      className={twMerge(
        "bg-white border border-gray-light text-gray-dark",
        className
      )}
      {...props}
    >
      {children}
    </PrimaryButton>
  );
}

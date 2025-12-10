import { twMerge } from "tailwind-merge";
import type { HTMLProps } from "../../lib/helpers";
export type ButtonProps = HTMLProps<"button">;

export default function PrimaryButton({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        "bg-primary shadow-sm text-white px-4 py-2 rounded-full font-bold hover:opacity-80 hover:shadow-md cursor-pointer duration-150",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

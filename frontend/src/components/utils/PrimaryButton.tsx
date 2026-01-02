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
        "from-primary/80 to-primary bg-linear-to-br text-white whitespace-nowrap cursor-pointer border border-white/30 px-4 py-2 text-sm rounded-full shadow-sm duration-300 transition-colors hover:from-primary/60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

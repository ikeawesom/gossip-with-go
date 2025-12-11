import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";

export default function Notice({
  children,
  className,
  type,
}: DefaultCustomProps & { type?: "warning" | "success" }) {
  return (
    <div
      className={twMerge(
        "border px-4 py-2 w-full",
        type === "warning"
          ? "bg-red-100 rounded-md text-red-700 border-red-700"
          : type === "success"
          ? "bg-green-100 rounded-md text-green-700 border-green-700"
          : "text-primary border border-primary bg-primary/20",
        className
      )}
    >
      {children}
    </div>
  );
}

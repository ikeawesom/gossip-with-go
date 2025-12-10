import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";

export default function Card({ className, children }: DefaultCustomProps) {
  return (
    <div
      className={twMerge(
        "bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-6 w-full max-w-[800px]",
        className
      )}
    >
      {children ?? "Card"}
    </div>
  );
}

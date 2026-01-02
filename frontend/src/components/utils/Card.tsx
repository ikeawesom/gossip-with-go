import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";

export default function Card({ className, children }: DefaultCustomProps) {
  return (
    <div
      className={twMerge(
        "from-white/90 to-white/50 bg-linear-to-br backdrop-blur-md border border-white/20 rounded-xl shadow-sm p-6 w-full max-w-[800px]",
        className
      )}
    >
      {children ?? "Card"}
    </div>
  );
}

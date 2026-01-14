import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
export type DivProps = ComponentPropsWithoutRef<"div">;

export default function Card({ children, className, ...props }: DivProps) {
  return (
    <div
      className={twMerge(
        "from-white/90 to-white/50 bg-linear-to-br backdrop-blur-md border border-white/20 rounded-xl shadow-sm p-3 md:p-5 w-full max-w-[800px]",
        className
      )}
      {...props}
    >
      {children ?? "Card"}
    </div>
  );
}

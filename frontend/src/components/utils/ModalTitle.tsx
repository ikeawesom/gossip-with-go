import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";

export default function ModalTitle({
  children,
  className,
}: DefaultCustomProps) {
  return (
    <h3
      className={twMerge(
        "text-2xl font-semibold border-b border-gray-dark/20 w-full pb-2",
        className
      )}
    >
      {children}
    </h3>
  );
}

import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";

export default function AuthForm({
  children,
  className,
  onSubmit,
}: DefaultCustomProps & { onSubmit?: (e: React.FormEvent) => void }) {
  return (
    <form
      onSubmit={onSubmit ? onSubmit : () => null}
      className={twMerge(
        "w-full max-w-[600px] flex flex-col gap-2 items-start justify-center",
        className
      )}
    >
      {children}
    </form>
  );
}

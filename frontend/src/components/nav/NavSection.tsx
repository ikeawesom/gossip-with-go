import NavBar from "./NavBar";
import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";

export default function NavSection({
  children,
  className,
}: DefaultCustomProps) {
  return (
    <section>
      <NavBar />
      <section className="pt-18 w-full flex items-start justify-center">
        <div
          className={twMerge(
            "w-full max-w-[1200px] p-6 min-h-screen",
            className
          )}
        >
          {children}
        </div>
      </section>
    </section>
  );
}

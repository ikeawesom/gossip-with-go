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
      <section className="pt-18 w-full flex items-start justify-center min-h-screen from-primary/30 to-primary/5 bg-linear-145">
        <div className={twMerge("w-full max-w-[800px] p-6", className)}>
          {children}
        </div>
      </section>
    </section>
  );
}

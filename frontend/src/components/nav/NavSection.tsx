import NavBar from "./NavBar";
import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";

interface NavSectionProps extends DefaultCustomProps {
  showAccount?: boolean;
}

export default function NavSection({
  children,
  className,
  showAccount,
}: NavSectionProps) {
  return (
    <section>
      <NavBar showAccount={showAccount} />
      <section className="pt-18 w-full flex items-start justify-center">
        <div className={twMerge("w-full max-w-[800px] p-6", className)}>
          {children}
        </div>
      </section>
    </section>
  );
}

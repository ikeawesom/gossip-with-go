import NavBar from "./NavBar";
import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";
import Footer from "../Footer";
import CreatePostTopicSection from "../../pages/CreatePostTopicSection";

export default function NavSection({
  children,
  className,
}: DefaultCustomProps) {
  return (
    <section>
      <NavBar />
      <section className="pt-18 w-full flex items-center justify-between flex-col min-h-screen from-primary/30 to-primary/5 bg-linear-145">
        <div className={twMerge("w-full max-w-[800px] p-6", className)}>
          {children}
        </div>
        <Footer />
      </section>
      <div className="w-full fixed bottom-0 left-0 flex items-center justify-center p-4 px-6 z-50">
        <div className="w-full max-w-[800px] flex items-center justify-end">
          <CreatePostTopicSection />
        </div>
      </div>
    </section>
  );
}

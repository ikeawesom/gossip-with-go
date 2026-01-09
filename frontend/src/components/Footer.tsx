import Logo from "./utils/Logo";

export default function Footer() {
  return (
    <footer className="w-full min-h-1/5 py-6 px-3 flex items-center flex-col gap-2 justify-center mt-20 from-transparent to-primary/30 bg-linear-to-b pb-20">
      <Logo color />
      <div className="flex items-center justify-center gap-4">
        <p className="fine-print">A CVWO Project</p>
        <p className="fine-print">•</p>
        <p className="fine-print">Created by Ike Lim.</p>
      </div>
    </footer>
  );
}

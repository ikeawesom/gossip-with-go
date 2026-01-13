import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";
import ArrowRight from "./ArrowRight";

interface ModalTitleType extends DefaultCustomProps {
  back?: () => void;
}

export default function ModalTitle({
  children,
  className,
  back,
}: ModalTitleType) {
  return (
    <div className="flex items-center justify-start gap-2 border-b border-gray-dark/20 w-full pb-2">
      {back && (
        <ArrowRight
          className="cursor-pointer hover:opacity-70 duration-150"
          size={20}
          rotate
          onClick={back}
        />
      )}
      <h3 className={twMerge("text-2xl font-semibold ", className)}>
        {children}
      </h3>
    </div>
  );
}

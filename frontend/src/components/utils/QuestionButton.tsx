import type { DefaultCustomProps } from "../../lib/constants";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export interface InfoInterface extends DefaultCustomProps {
  info: string;
}

export default function QuestionButton({ info, className }: InfoInterface) {
  const handleToast = () => {
    toast.info(info);
  };

  return (
    <img
      onClick={handleToast}
      className={twMerge(
        "cursor-pointer hover:opacity-70 duration-150 -mt-2",
        className
      )}
      src="/utils/icon_question.svg"
      alt="What is this?"
      width={20}
      height={20}
    />
  );
}

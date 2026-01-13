import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";

interface RightArrowInterface extends DefaultCustomProps {
  rotate?: boolean;
  size?: number;
  onClick?: () => void;
}

export default function ArrowRight({
  size,
  rotate,
  className,
  onClick,
}: RightArrowInterface) {
  return (
    <img
      onClick={onClick ? onClick : () => {}}
      className={twMerge(rotate ? "rotate-180" : "", className)}
      src="/utils/arrow_right.svg"
      alt="Next"
      height={size ?? 80}
      width={size ?? 80}
    />
  );
}

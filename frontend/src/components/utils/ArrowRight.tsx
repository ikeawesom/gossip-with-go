import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";

interface RightArrowInterface extends DefaultCustomProps {
  rotate?: boolean;
  size?: number;
}

export default function ArrowRight({
  size,
  rotate,
  className,
}: RightArrowInterface) {
  return (
    <img
      className={twMerge(rotate ? "rotate-180" : "", className)}
      src="/utils/arrow_right.svg"
      alt="Next"
      height={size ?? 80}
      width={size ?? 80}
    />
  );
}

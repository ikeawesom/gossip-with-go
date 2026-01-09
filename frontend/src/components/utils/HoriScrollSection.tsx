import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import ArrowRight from "./ArrowRight";
import Card from "./Card";

export default function HoriScrollSection({
  title,
  scrollAmount,
  icon,
  children,
}: {
  icon?: React.ReactNode;
  scrollAmount?: number;
  title: string;
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(true);
  const [before, setBefore] = useState(false);

  scrollAmount = scrollAmount ?? 400;

  const scrollBack = () => {
    setMore(true);
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });

      const { scrollLeft } = scrollRef.current;
      if (scrollLeft <= scrollAmount) {
        setBefore(false);
      }
    }
  };

  const scrollNext = () => {
    setBefore(true);
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth + scrollAmount >= scrollWidth) {
        setMore(false);
      }
    }
  };
  return (
    <div className="w-full flex items-start justify-center gap-2 flex-col">
      <div className="w-full flex items-center justify-between gap-1">
        <h2 className="flex items-center justify-start">
          {title}
          {icon && icon}
        </h2>
        <div className="flex items-center justify-end gap-3">
          <Card
            onClick={scrollBack}
            className={twMerge(
              "group grid place-items-center md:p-2 md:px-1 p-2 rounded-lg",
              !before
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer hover:from-white duration-300"
            )}
          >
            <ArrowRight size={15} rotate />
          </Card>
          <Card
            onClick={scrollNext}
            className={twMerge(
              "group grid place-items-center md:p-2 md:px-1 p-2 rounded-lg",
              !more
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer hover:from-white duration-300"
            )}
          >
            <ArrowRight size={15} />
          </Card>
        </div>
      </div>
      <div className="w-full flex justify-center items-center gap-3">
        <div
          ref={scrollRef}
          className="overflow-x-scroll"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex gap-4 min-w-max py-2 items-stretch justify-start">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

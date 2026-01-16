import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import ArrowRight from "./ArrowRight";
import Card from "./Card";

export default function HoriScrollSection({
  title,
  scrollAmount,
  icon,
  children,
  floatingArrows,
  gap,
  isModal,
}: {
  icon?: React.ReactNode;
  scrollAmount?: number;
  title?: string;
  children: React.ReactNode;
  floatingArrows?: boolean;
  gap?: string;
  isModal?: boolean;
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
    <div className="w-full flex items-start justify-center gap-3 flex-col">
      {!floatingArrows && (
        <div className="w-full flex items-center justify-between gap-1">
          {title && (
            <h2 className="custom text-xl sm:text-2xl font-bold flex items-center justify-start">
              {title}
              {icon && icon}
            </h2>
          )}
          {!floatingArrows && (
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
          )}
        </div>
      )}
      <div className="w-full flex justify-center items-center gap-3 relative">
        <div
          ref={scrollRef}
          className={twMerge(
            "overflow-x-scroll",
            isModal && "rounded-xl border border-gray-dark/20 shadow-sm"
          )}
          style={{ scrollbarWidth: "none" }}
        >
          <div
            className={twMerge(
              "flex min-w-max items-stretch justify-start",
              gap ? gap : "gap-4 "
            )}
          >
            {children}
          </div>
        </div>
        {floatingArrows && (
          <>
            <Card
              onClick={scrollBack}
              className={twMerge(
                "group rounded-full grid place-items-center md:p-2 md:px-1 p-2 w-8 h-8 absolute top-1/2 -translate-y-1/2",
                !before
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer hover:from-white duration-300",
                isModal ? "sm:-left-18 left-4" : "left-4"
              )}
            >
              <ArrowRight size={15} rotate />
            </Card>
            <Card
              onClick={scrollNext}
              className={twMerge(
                "group rounded-full grid place-items-center md:p-2 md:px-1 p-2 w-8 h-8 absolute top-1/2 -translate-y-1/2",
                !more
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer hover:from-white duration-300",
                isModal ? "sm:-right-18 right-4" : "right-4"
              )}
            >
              <ArrowRight size={15} />
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

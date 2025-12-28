import { useRef, useState } from "react";
import { DEFAULT_TOPICS } from "../../lib/constants";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router-dom";
import ArrowRight from "../utils/ArrowRight";

export default function TopicsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(true);
  const [before, setBefore] = useState(false);

  const scrollAmount = 400;

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
    <div className="w-full flex items-center justify-center gap-1 flex-col">
      <h4>Explore your favourite topics</h4>
      <div className="w-full flex justify-center items-center gap-3">
        <div
          onClick={scrollBack}
          className={twMerge(
            "group h-full grid place-items-center",
            !before ? "cursor-not-allowed" : "cursor-pointer"
          )}
        >
          <ArrowRight
            className={twMerge(
              !before ? "opacity-70" : "group-hover:-translate-x-1 duration-150"
            )}
            rotate
          />
        </div>

        <div
          ref={scrollRef}
          className="overflow-x-scroll"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex gap-4 min-w-max">
            {Object.keys(DEFAULT_TOPICS).map((id: string) => (
              <Link
                key={id}
                to={`/topics/${id}`}
                className="border-white/20 bg-white/60 min-[800px]hover:border-white/20 min-[800px]:bg-transparent min-[800px]:hover:bg-white/60 backdrop-blur-md border min-[800px]:border-transparent  duration-150 rounded-lg shrink-0 px-4 py-2"
              >
                {DEFAULT_TOPICS[id].title}
              </Link>
            ))}
          </div>
        </div>
        <div
          onClick={scrollNext}
          className={twMerge(
            "group grid place-items-center h-full",
            !more ? "cursor-not-allowed" : "cursor-pointer"
          )}
        >
          <ArrowRight
            className={twMerge(
              !more ? "opacity-70" : "group-hover:translate-x-1 duration-150"
            )}
          />
        </div>
      </div>
    </div>
  );
}

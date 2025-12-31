import { useEffect, useRef, useState } from "react";
import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";

interface LongContentType extends DefaultCustomProps {
  content: string;
  left?: boolean;
  largeClamp?: boolean;
}
export default function LongContent({
  content,
  children,
  className,
  left,
  largeClamp,
}: LongContentType) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = contentRef.current;
    if (element) {
      setShowReadMore(element.scrollHeight > element.clientHeight);
    }
  }, [content]);

  return (
    <div
      className={twMerge(
        "w-full flex flex-col items-start justify-start",
        className
      )}
    >
      <p
        ref={contentRef}
        className={twMerge(
          "smart-wrap whitespace-pre-wrap",
          !isExpanded && (largeClamp ? "line-clamp-3" : "line-clamp-6")
        )}
      >
        {content}
      </p>
      {showReadMore && (
        <p
          onClick={() => setIsExpanded(!isExpanded)}
          className={twMerge(
            "font-bold cursor-pointer hover:opacity-70 duration-150",
            left ? "" : "self-end mr-2"
          )}
        >
          {isExpanded ? "Read less" : "Read more"}
        </p>
      )}
      {children}
    </div>
  );
}

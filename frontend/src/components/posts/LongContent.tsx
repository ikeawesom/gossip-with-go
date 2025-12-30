import { useEffect, useRef, useState } from "react";
import type { DefaultCustomProps } from "../../lib/constants";
import { twMerge } from "tailwind-merge";

interface LongContentType extends DefaultCustomProps {
  content: string;
}
export default function LongContent({ content, children }: LongContentType) {
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
    <div className="mt-3 w-full border-t border-gray-dark/20 pt-2 flex flex-col items-start justify-start">
      <p
        ref={contentRef}
        className={twMerge(
          "smart-wrap whitespace-pre-wrap",
          !isExpanded && "line-clamp-6"
        )}
      >
        {content}
      </p>
      {showReadMore && (
        <h4
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 self-end mr-2 custom text-primary text-sm cursor-pointer hover:opacity-70 duration-150"
        >
          {isExpanded ? "Read less" : "Read more"}
        </h4>
      )}
      {children}
    </div>
  );
}

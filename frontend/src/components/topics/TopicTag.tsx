import { twMerge } from "tailwind-merge";
import { COLORS_ARR } from "../../lib/constants";
import { trimString } from "../../lib/helpers";

export default function TopicTag({
  topic_class,
  topic_name,
  trim,
}: {
  topic_class: string;
  topic_name: string;
  trim?: boolean;
}) {
  return (
    <p
      className={twMerge(
        "topic-tag smart-wrap",
        COLORS_ARR[topic_class]?.color
      )}
    >
      {trim ? trimString(topic_name, 20) : topic_name}
    </p>
  );
}

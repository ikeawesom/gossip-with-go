import { twMerge } from "tailwind-merge";
import { COLORS_ARR } from "../../lib/constants";

export default function TopicTag({
  topic_class,
  topic_name,
}: {
  topic_class: string;
  topic_name: string;
}) {
  return (
    <p className={twMerge("topic-tag", COLORS_ARR[topic_class]?.color)}>
      {topic_name}
    </p>
  );
}

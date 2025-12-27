import { twMerge } from "tailwind-merge";
import { getTopicColor } from "../../lib/helpers";
import { DEFAULT_TOPICS } from "../../lib/constants";

export default function TopicTag({ topic_id }: { topic_id: string }) {
  return (
    <p className={twMerge("topic-tag", getTopicColor(topic_id))}>
      {DEFAULT_TOPICS[topic_id].title}
    </p>
  );
}

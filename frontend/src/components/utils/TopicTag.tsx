import { twMerge } from "tailwind-merge";
import { getTopicColor } from "../../lib/helpers";

export default function TopicTag({ topic }: { topic: string }) {
  return <p className={twMerge("topic-tag", getTopicColor(topic))}>{topic}</p>;
}

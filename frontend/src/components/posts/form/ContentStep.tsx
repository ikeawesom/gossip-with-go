import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { usePostForm } from "../../../contexts/PostFormContext";
import useQuery, { type QueryResult } from "../../../hooks/useQuery";
import PrimaryButton from "../../utils/PrimaryButton";
import SpinnerPrimary from "../../spinner/SpinnerPrimary";
import type { Topic } from "../../../types/topics";

interface ContentStepProps {
  toggleTopic?: () => void;
  showTopicSelector?: boolean;
  isEdit?: boolean;
}

export default function ContentStep({
  toggleTopic,
  showTopicSelector = true,
  isEdit = false,
}: ContentStepProps) {
  const { postDetails, updateField } = usePostForm();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { loading, results } = useQuery(query, "topics");

  return (
    <div className="flex flex-col items-start justify-start gap-2 w-full">
      <input
        value={postDetails.title}
        onChange={(e) => updateField("title", e.target.value)}
        required
        type="text"
        className="not-rounded"
        placeholder="Enter a title for your post"
      />

      <textarea
        value={postDetails.content}
        onChange={(e) => updateField("content", e.target.value)}
        required
        placeholder="Share your thoughts here..."
        className="resize-none h-[200px] text-sm"
      />

      {showTopicSelector && (
        <div className="w-full -mt-2 mb-1">
          <label
            htmlFor="topics"
            className={twMerge("ml-1", isEdit ? "custom text-gray-dark" : "")}
          >
            What is this for?
          </label>

          <div className="flex items-center justify-between gap-3">
            <input
              onClick={() => setShowResults(true)}
              placeholder="Enter a topic"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <h4 className="custom">Or</h4>
            <PrimaryButton onClick={toggleTopic}>Start a Topic</PrimaryButton>
          </div>

          {postDetails.topicName !== "" && (
            <p className="mt-2 custom text-sm text-gray-dark">
              Selected Topic:{" "}
              <span className="text-primary font-bold">
                {postDetails.topicName}
              </span>
            </p>
          )}

          {showResults && (
            <ul
              className="overflow-y-scroll bg-white rounded-lg mt-3 h-[100px] shadow-sm"
              style={{ scrollbarWidth: "none" }}
            >
              {loading ? (
                <li className="h-[100px] grid place-items-center p-2">
                  <SpinnerPrimary />
                </li>
              ) : results.length > 0 ? (
                results.map((item: QueryResult, index: number) => {
                  const topic = item as Topic;
                  return (
                    <li
                      onClick={() => {
                        updateField("topic", topic.id);
                        updateField("topicName", topic.topic_name);
                        setShowResults(false);
                        setQuery(topic.topic_name);
                      }}
                      key={index}
                      className="text-sm p-2 border-b border-gray-light hover:bg-fine-print/25 cursor-pointer text-gray-dark"
                    >
                      {topic.topic_name}
                      <p className="fine-print custom text-xs">
                        {topic.username === "admin"
                          ? "FREE TOPICS"
                          : `Created by ${topic.username}`}
                      </p>
                    </li>
                  );
                })
              ) : (
                <li className="text-sm text-fine-print text-center h-[100px] grid place-items-center">
                  {query.length > 0
                    ? "Hmm, no results were found. Try another keyword."
                    : "Search for a topic."}
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

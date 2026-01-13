import React, { useState } from "react";
import { toast } from "sonner";
import ModalTitle from "../utils/ModalTitle";
import { COLORS_ARR } from "../../lib/constants";
import { twMerge } from "tailwind-merge";
import PrimaryButton from "../utils/PrimaryButton";
import SpinnerSecondary from "../spinner/SpinnerSecondary";
import { topicApi } from "../../api/topics.api";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { ApiError } from "../../types/auth";

export interface CreateTopicType {
  title: string;
  desc: string;
  topicClass: string;
}

export default function CreateTopicForm() {
  const [topicDetails, setTopicDetails] = useState<CreateTopicType>({
    desc: "",
    title: "",
    topicClass: Object.keys(COLORS_ARR)[0],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const disabled =
    topicDetails.title === "" || topicDetails.desc === "" || loading;

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await topicApi.createTopic(topicDetails);
      navigate(`/topics/${res.data.topic.id}`);
    } catch (err) {
      // get full axios error
      const axiosError = err as AxiosError<ApiError>;
      console.log("[TOPIC ERROR]:", axiosError.response?.data);

      // toast error or default error
      toast.error(
        axiosError.response?.data?.message ||
          "Failed to create topic. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleCreateTopic}
      className="w-full flex flex-col items-start justify-start gap-3"
    >
      <ModalTitle>Start a New Topic</ModalTitle>
      <input
        value={topicDetails.title}
        onChange={(e) =>
          setTopicDetails({ ...topicDetails, title: e.target.value })
        }
        required
        type="text"
        className="not-rounded"
        placeholder="Enter a title for your new topic"
      />
      <input
        value={topicDetails.desc}
        onChange={(e) =>
          setTopicDetails({ ...topicDetails, desc: e.target.value })
        }
        required
        type="text"
        className="not-rounded"
        placeholder="Enter a description for your new topic"
      />
      <div className="w-full">
        <label htmlFor="topics" className="ml-[0.5px]">
          Pick a theme colour for your topic
        </label>
        <select
          id="colors"
          value={topicDetails.topicClass}
          onChange={(e) =>
            setTopicDetails({ ...topicDetails, topicClass: e.target.value })
          }
        >
          {Object.keys(COLORS_ARR).map((id: string, index: number) => (
            <option
              value={id}
              key={index}
              className="flex items-center justify-start"
            >
              {COLORS_ARR[id].title}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2 border-t border-gray-dark/20 pt-2 mt-3 text-sm">
          <span>Preview:</span>
          <div
            className={twMerge(
              "px-3 py-1 rounded",
              COLORS_ARR[topicDetails.topicClass]?.color || ""
            )}
          >
            {topicDetails.title.length > 0 ? topicDetails.title : "PREVIEW"}
          </div>
        </div>
      </div>

      <PrimaryButton
        type="submit"
        disabled={disabled}
        className="mt-2 self-end"
      >
        {loading ? <SpinnerSecondary /> : "Begin Discussion"}
      </PrimaryButton>
    </form>
  );
}

import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import ContentStep from "./ContentStep";
import MediaStep from "./MediaStep";
import SummaryStep from "./SummaryStep";
import {
  PostFormProvider,
  usePostForm,
} from "../../../contexts/PostFormContext";
import { postApi } from "../../../api/posts.api";
import { toast } from "sonner";
import type { ApiError } from "../../../types/auth";
import { defaultError } from "../../../lib/constants";
import type { PostType } from "../../../types/post";
import ModalTitle from "../../utils/ModalTitle";
import PrimaryButton from "../../utils/PrimaryButton";
import SpinnerSecondary from "../../spinner/SpinnerSecondary";
import SecondaryButton from "../../utils/SecondaryButton";
import { twMerge } from "tailwind-merge";

export interface CreatePostFormProps {
  toggleTopic?: () => void;
  username: string;
  curPost?: PostType;
  close: () => void;
  topic?: number;
  topicName?: string;
}

const steps = ["content", "media", "summary"];

function CreatePostFormContent({
  username,
  curPost,
  close,
  toggleTopic,
}: Omit<CreatePostFormProps, "topic" | "topicName">) {
  const navigate = useNavigate();
  const {
    postDetails,
    postStep,
    setPostStep,
    postLoad,
    setPostLoad,
    canProceed,
    cleanupImages,
  } = usePostForm();

  const isEdit = !!curPost;

  // extract form data
  const extractFormData = (): FormData => {
    const formData = new FormData();
    formData.append("title", postDetails.title);
    formData.append("content", postDetails.content);
    formData.append("username", postDetails.username);
    formData.append("topic", `${postDetails.topic}`);
    formData.append("topicName", postDetails.topicName);

    // add images if any
    postDetails.imagesFiles.forEach((file: File, index: number) => {
      formData.append(`image_${index}`, file);
    });

    formData.append("image_no", `${postDetails.imagesFiles.length}`);

    return formData;
  };

  // handle form submission
  const handleSubmit = async () => {
    if (curPost) {
      await handleSaveChanges(curPost);
    } else {
      await handleCreatePost();
    }
  };

  // create new post
  const handleCreatePost = async () => {
    setPostLoad(true);
    try {
      const formData = extractFormData();
      const res = await postApi.createPost(formData);

      toast.success("Posted!");
      cleanupImages();
      close();
      navigate(`/${username}/posts/${res.data.data}`);
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      console.error("[POST ERROR]:", axiosError.response?.data);
      toast.error(axiosError.response?.data?.message || defaultError.message);
    } finally {
      setPostLoad(false);
    }
  };

  // save changes to existing post
  const handleSaveChanges = async (curPost: PostType) => {
    setPostLoad(true);
    try {
      const formData = extractFormData();
      formData.append("postID", `${curPost.id}`);

      await postApi.editPostByID(formData);
      toast.success("Changes have been saved.");
      cleanupImages();
      window.location.reload();
      close();
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      console.error("[POST ERROR]:", axiosError.response?.data);
      toast.error(axiosError.response?.data?.message || defaultError.message);
    } finally {
      setPostLoad(false);
    }
  };

  const handleNext = async () => {
    if (postStep === "summary" || isEdit) {
      await handleSubmit();
    } else if (postStep === "content") {
      setPostStep("media");
    } else if (postStep === "media") {
      setPostStep("summary");
    }
  };

  const handleBack = () => {
    if (postStep === "summary") {
      setPostStep("media");
    } else if (postStep === "media") {
      setPostStep("content");
    }
  };

  return (
    <form className="w-full flex flex-col items-start justify-start gap-3">
      <ModalTitle>{isEdit ? "Edit Post" : "Share your thoughts"}</ModalTitle>

      {!isEdit && (
        <div className="flex items-center gap-2 w-full">
          {steps.map((step: string, index: number) => {
            const stepKey = steps[index];
            const isActive = postStep === stepKey;
            const isPast = steps.indexOf(postStep) > index;

            return (
              <div
                key={step}
                className={`flex-1 h-1 rounded-full transition ${
                  isActive || isPast ? "bg-primary" : "bg-gray-200"
                }`}
              />
            );
          })}
        </div>
      )}

      <div className="w-full">
        {postStep === "content" && (
          <ContentStep
            toggleTopic={toggleTopic}
            showTopicSelector={!curPost?.topic && !!toggleTopic}
            isEdit={isEdit}
          />
        )}
        {postStep === "media" && <MediaStep />}
        {postStep === "summary" && <SummaryStep />}
      </div>

      <div className="flex items-center justify-between w-full gap-3">
        {postStep !== "content" && (
          <SecondaryButton
            type="button"
            className={twMerge((!canProceed || postLoad) && "opacity-70")}
            onClick={handleBack}
            disabled={!canProceed || postLoad}
          >
            Back
          </SecondaryButton>
        )}

        <div className="ml-auto" />

        {isEdit ? (
          <PrimaryButton onClick={handleNext}>
            {postLoad ? <SpinnerSecondary /> : "Save Changes"}
          </PrimaryButton>
        ) : (
          <PrimaryButton
            className={twMerge((!canProceed || postLoad) && "opacity-70")}
            disabled={!canProceed || postLoad}
            type="button"
            onClick={handleNext}
          >
            {postLoad ? (
              <span className="flex items-center justify-center gap-2">
                Posting <SpinnerSecondary />
              </span>
            ) : postStep === "summary" ? (
              "Create Post"
            ) : (
              "Next"
            )}
          </PrimaryButton>
        )}
      </div>
    </form>
  );
}

// wrap with provider
export default function CreatePostForm(props: CreatePostFormProps) {
  return (
    <PostFormProvider
      username={props.username}
      curPost={props.curPost}
      topic={props.topic}
      topicName={props.topicName}
    >
      <CreatePostFormContent {...props} />
    </PostFormProvider>
  );
}

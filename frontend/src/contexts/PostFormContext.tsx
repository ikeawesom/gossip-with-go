import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { CreatePostRequest, PostType } from "../types/post";

type PostStep = "content" | "media" | "summary";

interface PostFormContextType {
  postDetails: CreatePostRequest;
  setPostDetails: React.Dispatch<React.SetStateAction<CreatePostRequest>>;
  postStep: PostStep;
  setPostStep: React.Dispatch<React.SetStateAction<PostStep>>;
  postLoad: boolean;
  setPostLoad: React.Dispatch<React.SetStateAction<boolean>>;
  updateField: (field: keyof CreatePostRequest, value: any) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  canProceed: boolean;
  cleanupImages: () => void;
}

const PostFormContext = createContext<PostFormContextType | null>(null);

interface PostFormProviderProps {
  children: React.ReactNode;
  username: string;
  curPost?: PostType;
  topic?: number;
  topicName?: string;
}

export function PostFormProvider({
  children,
  username,
  curPost,
  topic,
  topicName,
}: PostFormProviderProps) {
  const [postDetails, setPostDetails] = useState<CreatePostRequest>({
    title: curPost?.title ?? "",
    content: curPost?.content ?? "",
    topic: topic ?? -1,
    topicName: topicName ?? "",
    username,
    imagesFiles: [],
    imagesPreview: [],
  });

  const [postStep, setPostStep] = useState<PostStep>("content");
  const [postLoad, setPostLoad] = useState(false);

  const cleanupImages = useCallback(() => {
    postDetails.imagesPreview.forEach((url) => {
      URL.revokeObjectURL(url);
    });
  }, [postDetails.imagesPreview]);

  // only cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupImages();
    };
  }, []);

  // update a single field
  const updateField = (field: keyof CreatePostRequest, value: any) => {
    setPostDetails((prev) => ({ ...prev, [field]: value }));
  };

  // handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setPostDetails((prev) => ({
      ...prev,
      imagesPreview: [...prev.imagesPreview, previewUrl],
      imagesFiles: [...prev.imagesFiles, file],
    }));
  };

  // remove image
  const removeImage = (index: number) => {
    URL.revokeObjectURL(postDetails.imagesPreview[index]);

    setPostDetails((prev) => ({
      ...prev,
      imagesPreview: prev.imagesPreview.filter((_, i) => i !== index),
      imagesFiles: prev.imagesFiles.filter((_, i) => i !== index),
    }));
  };

  const canProceed =
    postDetails.title !== "" &&
    postDetails.content !== "" &&
    postDetails.topic !== -1;

  return (
    <PostFormContext.Provider
      value={{
        postDetails,
        setPostDetails,
        postStep,
        setPostStep,
        postLoad,
        setPostLoad,
        updateField,
        handleImageUpload,
        removeImage,
        canProceed,
        cleanupImages,
      }}
    >
      {children}
    </PostFormContext.Provider>
  );
}

export function usePostForm() {
  const context = useContext(PostFormContext);
  if (!context) {
    throw new Error("usePostForm must be used within PostFormProvider");
  }
  return context;
}

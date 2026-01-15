import { twMerge } from "tailwind-merge";
import { usePostForm } from "../../../contexts/PostFormContext";
import Card from "../../utils/Card";

export default function MediaStep() {
  const { postDetails, handleImageUpload, removeImage } = usePostForm();

  const picturesLen = postDetails.imagesPreview.length;
  const gotPictures = picturesLen > 0;
  const maxPictures = picturesLen === 5;

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full">
      {gotPictures && (
        <Card className="flex gap-1 items-start justify-around md:p-3 p-2 overflow-y-auto flex-wrap h-[281px] w-full">
          {postDetails.imagesPreview.map((src: string, index: number) => (
            <div
              key={index}
              className="relative h-40 w-40 rounded-md overflow-hidden border bg-gray-dark/10 border-gray-dark/20 shadow-sm group"
            >
              <img
                src={src}
                alt={`Image ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute cursor-pointer inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
              >
                <span className="text-white text-xs">Remove</span>
              </button>
            </div>
          ))}
        </Card>
      )}
      {gotPictures && (
        <p
          className={twMerge(
            "text-xs custom",
            maxPictures ? "text-red" : "fine-print"
          )}
        >
          {picturesLen}/5 added
        </p>
      )}
      <input
        disabled={maxPictures}
        id="pfp-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      <label
        htmlFor="pfp-upload"
        className={twMerge(
          "cursor-pointer transition flex items-center",
          gotPictures
            ? "gap-1 px-3 py-2 rounded-md duration-150"
            : "flex-col justify-center h-80",
          maxPictures
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-dark/10"
        )}
      >
        <img
          src="/image.svg"
          alt="Upload Image"
          width={gotPictures ? 25 : 100}
          height={gotPictures ? 25 : 100}
        />
        <p>
          {maxPictures
            ? "Maximum 5 images"
            : `Add ${gotPictures ? "more" : ""} images`}
        </p>
      </label>
    </div>
  );
}

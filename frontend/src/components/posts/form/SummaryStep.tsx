import { usePostForm } from "../../../contexts/PostFormContext";
import Card from "../../utils/Card";
import HoriScrollSection from "../../utils/HoriScrollSection";

export default function SummaryStep() {
  const { postDetails } = usePostForm();

  return (
    <div className="flex flex-col gap-4 w-full">
      {postDetails.imagesPreview.length > 0 && (
        <HoriScrollSection title="Summary">
          {postDetails.imagesPreview.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Preview ${index + 1}`}
              className="w-40 h-40 object-cover rounded-lg border"
            />
          ))}
        </HoriScrollSection>
      )}

      <Card className="space-y-1 overflow-y-scroll max-h-[300px]">
        <h2 className="text-lg custom font-bold">{postDetails.title}</h2>
        <p className="custom text-gray-dark whitespace-pre-wrap">
          {postDetails.content}
        </p>
      </Card>
    </div>
  );
}

import { twMerge } from "tailwind-merge";

export default function PfpImg({
  pfp,
  zoomed,
  onClick,
}: {
  pfp: string | undefined;
  zoomed?: boolean;
  onClick?: () => void;
}) {
  return (
    <label
      onClick={onClick}
      htmlFor="pfp-upload"
      className={twMerge(
        "relative rounded-full overflow-hidden border-2 border-gray-light shadow-sm grid place-items-center cursor-pointer hover:opacity-90 duration-150",
        zoomed ? "h-100 w-100" : "h-20 w-20"
      )}
    >
      <img
        src={pfp || "/utils/icon_avatar.svg"}
        alt="Profile Picture"
        className="h-full w-full object-cover"
      />
    </label>
  );
}

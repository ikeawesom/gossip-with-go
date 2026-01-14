import { twMerge } from "tailwind-merge";

export default function PfpImg({
  pfp,
  zoomed,
  onClick,
  icon,
}: {
  pfp: string | undefined;
  zoomed?: boolean;
  onClick?: () => void;
  icon?: boolean;
}) {
  return (
    <label
      onClick={onClick}
      htmlFor="pfp-upload"
      className={twMerge(
        "relative rounded-full overflow-hidden shadow-md grid place-items-center cursor-pointer hover:opacity-90 duration-150",
        icon ? "h-6 w-6" : zoomed ? "h-100 w-100" : "h-20 w-20",
        !icon && "border-2 border-gray-light"
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

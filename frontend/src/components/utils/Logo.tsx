import { Link } from "react-router-dom";
import { APP_NAME } from "../../lib/constants";

export default function Logo({
  link,
  color,
}: {
  link?: boolean;
  color?: boolean;
}) {
  return link ? (
    <Link to="/">
      <h1 className={`font-bold ${color ? "text-primary" : ""}`}>{APP_NAME}</h1>
    </Link>
  ) : (
    <h1 className={`font-bold ${color ? "text-primary" : ""}`}>{APP_NAME}</h1>
  );
}

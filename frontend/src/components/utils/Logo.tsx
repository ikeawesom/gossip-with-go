import { Link } from "react-router-dom";
import { APP_NAME } from "../../lib/constants";

export default function Logo({
  link,
  small,
  color,
}: {
  link?: boolean;
  color?: boolean;
  small?: boolean;
}) {
  return link ? (
    <Link to="/">
      {small ? (
        <h2 className={`font-bold ${color ? "text-primary" : ""}`}>
          {APP_NAME}
        </h2>
      ) : (
        <h1 className={`font-bold ${color ? "text-primary" : ""}`}>
          {APP_NAME}
        </h1>
      )}
    </Link>
  ) : (
    <h2 className={`font-bold ${color ? "text-primary" : ""}`}>{APP_NAME}</h2>
  );
}

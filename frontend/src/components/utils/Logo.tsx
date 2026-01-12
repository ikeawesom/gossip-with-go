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
        <img src="/favicon.svg" height={40} width={40} alt="Gossip with Go" />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <img src="/favicon.svg" height={60} width={60} alt="Gossip with Go" />
          <h1 className={`font-bold ${color ? "text-primary" : ""}`}>
            {APP_NAME}
          </h1>
        </div>
      )}
    </Link>
  ) : (
    <h2 className={`font-bold ${color ? "text-primary" : ""}`}>{APP_NAME}</h2>
  );
}

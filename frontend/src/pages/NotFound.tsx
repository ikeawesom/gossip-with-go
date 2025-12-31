import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="w-full grid place-items-center">
      <h1 className="text-7xl font-bold custom mb-2 text-primary">404</h1>
      <p className="custom">
        Hmm... seems like the page you are looking for doesn't exist. Try
        checking the link!
      </p>
      <p className="custom">
        Back to{" "}
        <Link
          to="/"
          className="text-sm text-primary hover:opacity-70 duration-150 mt-4"
        >
          Home
        </Link>
        .
      </p>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function LoginAlert() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gray-800">
      <h1 className="text-white text-3xl font-semibold">
        Please
        <Link to="/login" className="underline mx-3">
          login
        </Link>
        to view this page
      </h1>
    </div>
  );
}

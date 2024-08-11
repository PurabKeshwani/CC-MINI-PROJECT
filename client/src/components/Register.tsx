import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { handleLoginUser, handleRegisterUser } from "../lib/auth";

export default function Register() {
  const navigate= useNavigate();
  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      email: formData.get("email") as string,
    };
    if (data.username === "" || data.password === "") {
      toast.error("Please fill all the fields");
      return;
    } else if (data.username.length < 4) {
      toast.error("Username must be at least 4 characters long");
      return;
    } else if (data.username.length < 4 || data.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    toast.promise(handleRegisterUser(data.username, data.password, data.email), {
      loading: "Registering...",
      success: () => {
        navigate("/login");
        return "Registered successfully";
      },
      error: (error) => {
        return error.response.data.message;
      },
    });
  }
  return (
    <div className="h-full w-full bg-gray-800 flex flex-col items-center justify-center py-6 px-4">
      <div className="max-w-md w-full">
        <div className="p-8 rounded-2xl bg-gray-300 shadow">
          <h2 className="text-gray-800 text-center text-2xl font-bold">
            Register
          </h2>
          <form onSubmit={handleRegister} className="mt-8 space-y-4">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Username
              </label>
              <div className="relative flex items-center">
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full placeholder-black text-sm outline-none px-4 py-3 rounded-md bg-gray-400 text-black"
                  placeholder="Enter user name"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000"
                  stroke="#000"
                  className="w-4 h-4 absolute right-4"
                  viewBox="0 0 24 24"
                >
                  <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                  <path
                    d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                    data-original="#000000"
                  ></path>
                </svg>
              </div>
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Email</label>
              <div className="relative flex items-center">
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full placeholder-black text-sm outline-none px-4 py-3 rounded-md bg-gray-400 text-black"
                  placeholder="Enter user name"
                />
                <svg
                  fill="#000"
                  stroke="#000"
                  className="w-4 h-4 absolute right-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6m-2 0l-8 5-8-5h16m0 12H4V8l8 5 8-5v10z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full placeholder-black text-sm outline-none px-4 py-3 rounded-md bg-gray-400 text-black"
                  placeholder="Enter password"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000"
                  stroke="#bbb"
                  className="w-4 h-4 absolute right-4 cursor-pointer"
                  viewBox="0 0 128 128"
                >
                  <path
                    d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                    data-original="#000000"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="!mt-8">
              <button
                type="submit"
                className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Register
              </button>
            </div>
            <p className="text-gray-800 text-sm !mt-8 text-center">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

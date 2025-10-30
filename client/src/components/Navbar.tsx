import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import BrandMark from "./BrandMark";

export default function Navbar() {
  const [{ token }, _, removeCookies] = useCookies(["token"]);
  const handleLogout = () => removeCookies("token");
  return (
    <nav className="navbar fixed top-0 z-20 h-16 md:h-20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-[#e5e7eb] rounded-b-[20px] md:rounded-b-[30px]">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-3 items-center">
        {/* Left nav links */}
        <div className="justify-self-start hidden md:flex items-center gap-5">
          <Link to={"/"} className="hover:text-[#2563EB] transition-colors">
            Home
          </Link>
          {token && (
            <>
              <Link to={"/studio"} className="hover:text-[#2563EB] transition-colors">
                Studio
              </Link>
              <Link to={"/upload"} className="hover:text-[#2563EB] transition-colors">
                Upload
              </Link>
              <Link to={"/analytics"} className="hover:text-[#2563EB] transition-colors">
                Analytics
              </Link>
            </>
          )}
        </div>

        {/* Center brand */}
        <div className="justify-self-center h-full flex items-center">
          <Link to={"/"} aria-label="StreamFlix" className="block leading-none align-middle">
            <BrandMark className="block w-56 md:w-72 h-auto" />
          </Link>
        </div>

        {/* Right user section */}
        <div className="justify-self-end">
          {token ? (
            <div className="flex-none gap-2">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <svg viewBox="0 0 512 512" fill="currentColor" className="w-8 h-8">
                    <path d="M256 112c-48.6 0-88 39.4-88 88s39.4 88 88 88 88-39.4 88-88-39.4-88-88-88zm0 128c-22.06 0-40-17.95-40-40 0-22.1 17.9-40 40-40s40 17.94 40 40c0 22.1-17.9 40-40 40zm0-240C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 464c-46.73 0-89.76-15.68-124.5-41.79C148.8 389 182.4 368 220.2 368h71.69c37.75 0 71.31 21.01 88.68 54.21C345.8 448.3 302.7 464 256 464zm160.2-75.5c-27-42.2-73-68.5-124.4-68.5h-71.6c-51.36 0-97.35 26.25-124.4 68.48C65.96 352.5 48 306.3 48 256c0-114.7 93.31-208 208-208s208 93.31 208 208c0 50.3-18 96.5-47.8 132.5z" />
                  </svg>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white border border-[#e5e7eb] rounded-box z-[1] mt-3 w-52 p-2 shadow">
                  <li>
                    <a className="justify-between hover:text-[#2563EB]">
                      Profile
                      <span className="badge bg-[#2563EB] border-0 text-white">New</span>
                    </a>
                  </li>
                  <li onClick={handleLogout}>
                    <a className="hover:text-[#2563EB]">Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <Link to={"/login"} className="hover:text-[#2563EB]">Login</Link>
              &nbsp; / &nbsp;
              <Link to={"/register"} className="hover:text-[#2563EB]">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

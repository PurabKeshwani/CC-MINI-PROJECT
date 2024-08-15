import { Link } from "react-router-dom";
import { Video as VideoType } from "../types/video";

export default function Video({ video }: { video: VideoType }) {
  return (
    <div className="group m-5">
      <Link
        to={`/${video.id}`}
        className="w-[400px] h-[250px] bg-gray-200 group-hover:bg-[#cfd1d4] rounded-xl flex items-center justify-center"
      >
        <div className="w-[80%] h-[80%] flex items-center justify-center rounded-xl border-4 border-gray-800 ">
          <svg fill="black" viewBox="0 0 16 16" className="w-20 h-20">
            <path d="M2 3a.5.5 0 00.5.5h11a.5.5 0 000-1h-11A.5.5 0 002 3zm2-2a.5.5 0 00.5.5h7a.5.5 0 000-1h-7A.5.5 0 004 1zm2.765 5.576A.5.5 0 006 7v5a.5.5 0 00.765.424l4-2.5a.5.5 0 000-.848l-4-2.5z" />
            <path d="M1.5 14.5A1.5 1.5 0 010 13V6a1.5 1.5 0 011.5-1.5h13A1.5 1.5 0 0116 6v7a1.5 1.5 0 01-1.5 1.5h-13zm13-1a.5.5 0 00.5-.5V6a.5.5 0 00-.5-.5h-13A.5.5 0 001 6v7a.5.5 0 00.5.5h13z" />
          </svg>
        </div>
      </Link>
      <div className="flex pl-3 pt-1 justify-between items-center">
        <h2 className="text-xl">{video.title}</h2>
        <div className="dropdown dropdown-end select-none cursor-pointer border-none">
          <div tabIndex={0}>
            <svg
              viewBox="0 0 21 21"
              fill="white"
              className="h-8 w-8 select-none border-none"
              tabIndex={0}
            >
              <g fill="white" fillRule="evenodd">
                <path d="M11.5 10.5 A1 1 0 0 1 10.5 11.5 A1 1 0 0 1 9.5 10.5 A1 1 0 0 1 11.5 10.5 z" />
                <path d="M11.5 5.5 A1 1 0 0 1 10.5 6.5 A1 1 0 0 1 9.5 5.5 A1 1 0 0 1 11.5 5.5 z" />
                <path d="M11.5 15.5 A1 1 0 0 1 10.5 16.5 A1 1 0 0 1 9.5 15.5 A1 1 0 0 1 11.5 15.5 z" />
              </g>
            </svg>
          </div>
          <div
            tabIndex={0}
            className="card compact dropdown-content bg-base-100 rounded-box z-[1] w-40 shadow"
          >
            <div
              tabIndex={0}
              className="rounded-xl rounded-tr-none overflow-hidden"
            >
              <div className="flex flex-col items-start">
                <Link
                  to={`/${video.id}`}
                  className="flex items-center space-x-2 bg-gray-700 px-5 py-3 w-full hover:bg-gray-600"
                >
                  <p>View</p>
                  <svg
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z" />
                  </svg>
                </Link>
                {video.isAuthor && (
                  <Link
                    to={`/studio/${video.id}`}
                    className="flex items-center space-x-2 bg-gray-700 px-5 py-3 w-full hover:bg-gray-600"
                  >
                    <p>Edit</p>
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                    >
                      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

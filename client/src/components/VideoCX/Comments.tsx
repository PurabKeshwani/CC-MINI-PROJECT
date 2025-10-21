import { useRef } from "react";
import { addComment, deleteComment } from "../../lib/video";
import { trackVideoInteraction } from "../../lib/analytics";
import toast from "react-hot-toast";
import { useSetRecoilState } from "recoil";
import { videosAtom } from "../../atom/video";
import { Video } from "../../types/video";

export default function Comments({ video }: { video: Video }) {
  const setVideos = useSetRecoilState(videosAtom);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  
  async function handleAddComment() {
    if (!commentRef.current) return;
    const comment = commentRef.current.value;
    if (!comment) return;
    commentRef.current.value = "";
    toast.promise(
      addComment(video.id, comment).then((res) => {
        if (res) {
          // Track comment interaction
          trackVideoInteraction(video.id, 'comment');
          
          setVideos((prev) =>
            prev.map((video) =>
              video.id === video.id
                ? { ...video, comments: [res, ...video.comments] }
                : video
            )
          );
        }
        return "Comment added";
      }),
      {
        loading: "Adding comment...",
        success: "Comment added",
        error: "Failed to add comment",
      }
    );
  }

  async function handleDleteComment(videoID: string, commentID: number) {
    toast.promise(
      deleteComment(videoID, commentID).then(() => {
        setVideos((prev) =>
          prev.map((video) =>
            video.id === video.id
              ? { ...video, comments: video.comments.filter((c) => c.id !== commentID) }
              : video
          )
        );
        return "Comment added";
      }),
      {
        loading: "Deleting comment...",
        success: "Comment deleted",
        error: "Failed to delete comment",
      }
    );
  }

  return (
    <div className="mt-5 mb-20">
      <h1 className="mb-2 text-2xl">Comments</h1>
      <div className="my-4">
        <textarea
          ref={commentRef}
          className="w-full min-h-20 max-h-[400px] border-none outline-none p-3 bg-gray-700 rounded-xl"
          placeholder="Start typing your comments here..."
        />
        <button
          className="bg-green-500 px-5 py-2 rounded-lg mt-2"
          onClick={handleAddComment}
        >
          Send
        </button>
      </div>
      <div className="p-5">
        {video.comments.length > 0 ? (
          video.comments.map((comment) => (
            <div
              key={comment.id}
              className="group my-2 hover:bg-gray-700 p-3 rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <div className="rounded-full w-8 h-8 bg-gray-300 text-black flex justify-center items-center text-2xl">
                    {comment.user.username[0].toUpperCase()}
                  </div>

                  <p
                    className={`text-xl text-white font-bold ${
                      comment.isAuthor ? "underline" : ""
                    }`}
                  >
                    @{comment.user.username}
                  </p>
                </div>
                <p className="text-lg ml-12 mt-1">{comment.content}</p>
              </div>
              {comment.isAuthor && (
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
                      onClick={() => handleDleteComment(video.id, comment.id)}
                      className="rounded-xl rounded-tr-none overflow-hidden"
                    >
                      <div className="flex flex-col items-start px-3 py-2 hover:bg-red-600 hover:text-black">
                        Delete
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-lg">No comments yet</p>
        )}
      </div>
    </div>
  );
}

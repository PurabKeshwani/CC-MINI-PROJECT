import { useCallback, useEffect, useState } from "react";
import { deleteVideo, getVideo, updateVideo } from "../lib/video";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Video, VideoVisibility } from "../types/video";
import { useCookies } from "react-cookie";
import LoginAlert from "./LoginAlert";
import { useRecoilState, useSetRecoilState } from "recoil";
import { videosAtom } from "../atom/video";
import toast from "react-hot-toast";
import Loader from "./Loader";
import AuthorAlert from "./AuthorAlert";

export default function StudioVideoCX() {
  const [{ token }] = useCookies(["token"]);
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [editValues, setEditValues] = useState<Video | null>(null);
  const [laoding, setLaoding] = useState(true);
  const [videos, setVideos] = useRecoilState(videosAtom);
  useEffect(() => {
    if (!id) return;

    const videoFromState = videos.find((video) => video.id === id);

    if (videoFromState) {
      setVideo(videoFromState);
      setEditValues(videoFromState);
      setLaoding(false);
      return;
    }

    getVideo(id)
      .then((res) => {
        if (!res) return;
        setVideo(res);
        setEditValues(res);
        setVideos((prev) => [...prev, res]);
      })
      .finally(() => setLaoding(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return token ? (
    laoding ? (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="w-10 h-10" />
      </div>
    ) : video && video.isAuthor ? (
      editValues ? (
        <StudioVideo
          video={video}
          editVideo={editValues}
          setEditValues={
            setEditValues as React.Dispatch<React.SetStateAction<Video>>
          }
          setVideo={setVideo as React.Dispatch<React.SetStateAction<Video>>}
        />
      ) : null
    ) : (
      <AuthorAlert />
    )
  ) : (
    <LoginAlert />
  );
}

function StudioVideo({
  video,
  editVideo,
  setEditValues,
  setVideo,
}: {
  video: Video;
  editVideo: Video;
  setEditValues: React.Dispatch<React.SetStateAction<Video>>;
  setVideo: React.Dispatch<React.SetStateAction<Video>>;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deteleLoading, setDeleteLoading] = useState(false);
  const setVideos = useSetRecoilState(videosAtom);

  const handleEditVideo = useCallback(() => {
    if (loading)
      return toast.error("Please wait for the current operation to complete");

    const finalValue: Partial<Video> = Object.fromEntries(
      Object.entries(editVideo).filter(
        ([key, value]) => value !== video[key as keyof Video]
      )
    );

    if (Object.keys(finalValue).length === 0) {
      return toast.error("No changes made to the video");
    }

    setLoading(true);
    toast.promise(
      updateVideo(video.id, finalValue as Video)
        .then((res) => {
          const updatedVideo: Video = {
            ...video,
            ...finalValue,
            updatedAt: new Date(res.updatedAt),
          };
          setEditValues(updatedVideo);
          setVideo(updatedVideo);
          setVideos((prev) =>
            prev.map((vid) => (vid.id === video.id ? updatedVideo : vid))
          );
        })
        .finally(() => setLoading(false)),
      {
        loading: "Updating video...",
        success: "Video updated successfully",
        error: "Failed to update video",
      }
    );
  }, [editVideo, loading, setEditValues, setVideo, setVideos, video]);

  const handeleDeleteVideo = useCallback(() => {
    if (loading)
      return toast.error("Please wait for the current operation to complete");

    setDeleteLoading(true);
    toast.promise(
      deleteVideo(video.id)
        .then(() => {
          setVideos((prev) => prev.filter((vid) => vid.id !== video.id));
          navigate("/studio");
        })
        .finally(() => setDeleteLoading(false)),
      {
        loading: "Deleting video...",
        success: "Video deleted successfully",
        error: "Failed to delete video",
      }
    );
  }, [loading, navigate, setVideos, video]);

  useEffect(() => {
    function handleSave(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleEditVideo();
      }
    }
    window.addEventListener("keydown", handleSave);
    return () => window.removeEventListener("keydown", handleSave);
  }, [handleEditVideo]);

  return (
    <div className="w-full h-full flex flex-col p-10 bg-gray-800 overflow-y-auto overflow-x-hidden">
      <div className="mb-10 flex justify-between">
        <h1 className="text-3xl font-extrabold ">Video Details</h1>
        <h1 className="text-xl font-extrabold">
          Last Updated: {editVideo.updatedAt.toLocaleString()}
        </h1>
      </div>{" "}
      <div className="text-2xl font-bold mb-4">
        Media URL:
        <Link
          className="text-lg font-bold ml-3 underline"
          target="_blank"
          to={editVideo.url}
        >
          {editVideo.url}
        </Link>
      </div>
      <label className="w-full flex items-center m-3">
        <p className="text-2xl font-bold">Title:</p>
        <input
          type="text"
          placeholder="Enter video title"
          className="input input-bordered w-full mx-3"
          value={editVideo.title}
          onChange={(e) =>
            setEditValues((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </label>
      <label className="w-full flex flex-col justify-center space-y-3 m-3">
        <p className="text-2xl font-bold">Description:</p>
        <textarea
          placeholder="Enter video description"
          className="input input-bordered mx-3 min-h-[400px] px-5 py-3"
          value={editVideo.description}
          onChange={(e) =>
            setEditValues((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </label>
      <label className="w-full flex items-center m-3">
        <p className="text-2xl font-bold mr-3">Visibility:</p>
        <select
          className="select select-bordered w-full max-w-xs"
          value={editVideo.visibility}
          onChange={(e) =>
            setEditValues((prev) => ({
              ...prev,
              visibility: e.target.value as VideoVisibility,
            }))
          }
        >
          {Object.values(VideoVisibility).map((visibility, index) => (
            <option key={index} value={visibility}>
              {visibility}
            </option>
          ))}
        </select>
      </label>
      <div className="flex space-x-5 mx-auto">
        <button
          onClick={handleEditVideo}
          className={`btn btn-success mt-10 w-[200px] ${
            loading ? "animate-pulse" : ""
          }`}
        >
          Save
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
        <button
          onClick={handeleDeleteVideo}
          className={`btn btn-error mt-10 w-[200px] mx-auto ${
            deteleLoading ? "animate-pulse" : ""
          }`}
        >
          Delete
          <svg viewBox="0 0 1024 1024" fill="currentColor" className="w-5 h-5">
            <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

import {
  useState,
  useCallback,
  DragEvent,
  useRef,
  useMemo,
  useEffect,
} from "react";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { uploadFIle } from "../lib/video";

export default function UploadBox() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [{ token }] = useCookies(["token"]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (loading) {
      window.onbeforeunload = function () {
        return "Are you sure to close the page?";
      };
      return () => {
        window.onbeforeunload = null;
      };
    } else {
      window.onbeforeunload = null;
    }
  }, [loading]);

  const size = useMemo(() => {
    if (!file) return 0;
    const gb = 1024 ** 3;
    const mb = 1024 ** 2;
    const kb = 1024;
    if (file.size > gb) {
      return `${(file.size / gb).toFixed(2)} GB`;
    } else if (file.size > mb) {
      return `${(file.size / mb).toFixed(2)} MB`;
    } else if (file.size > kb) {
      return `${(file.size / kb).toFixed(2)} KB`;
    } else {
      return `${file.size} bytes`;
    }
  }, [file]);

  async function finalUpload() {
    if (!token) {
      return toast.error("You need to log in to upload a video");
    }
    if (loading) return toast.error("Please wait for the current upload");
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    const promiseFunction = uploadFIle(file).finally(() => setLoading(false));
    toast.promise(promiseFunction, {
      loading: "Uploading...",
      success: (data) => {
        navigate(`/studio/${data.id}`);
        return "File uploaded successfully";
      },
      error: (e) => {
        if (e.response.data.message) return e.response.data.message;
        console.error(e);
        return "An error occurred while uploading the file";
      },
    });
  }

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const checkFile = useCallback(
    (file: File) => {
      if (loading) return toast.error("Please wait for the current upload");
      if (!token) {
        return toast.error(
          <>
            You need to &nbsp;
            <Link to="/login" className="underline">
              log in
            </Link>
            &nbsp; to upload
          </>
        );
      }
      if (file.type.includes("video")) {
        //check extension
        const validExtensions = ["mp4"];
        const extension = file.name.split(".").pop();
        if (extension && validExtensions.includes(extension)) {
          if (file.size > 50 * 1024 * 1024) {
            toast.error(
              "File size is too large. Please upload a smaller file."
            );
          } else {
            setFile(file);
            toast.success("File is ready to upload.");
          }
        } else {
          toast.error("Invalid file extension. Please upload a video file.");
        }
      } else {
        toast.error("Invalid file type. Please upload a video file.");
      }
    },
    [loading, token]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        checkFile(files[0]);
      }
    },
    [checkFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        checkFile(files[0]);
      }
    },
    [checkFile]
  );

  const resetForm = () => {
    if (!file || !inputRef.current) return;
    setFile(null);
    inputRef.current.value = "";
  };

  return (
    <div className="w-full h-full lg:w-[90%] lg:h-[90%] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-5xl mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Upload a video
        </h1>
        <p className="mt-3 text-gray-400">
          Drag and drop your MP4 or click to browse. We’ll transcode it for smooth streaming.
        </p>
      </div>
      <div
        className={`relative flex items-center justify-center w-[95%] max-w-5xl h-80 rounded-2xl cursor-pointer border-2 border-dashed transition-colors card-dark ${
          isDragOver
            ? "border-[#E50914] bg-[#1f1f1f]"
            : "border-[#2b2b2b] bg-[#1f1f1f] hover:border-[#E50914]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onChange={handleFileChange}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-transparent to-black/10" />
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-10 h-10 mb-4 text-[#E50914]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-300">
              <span className="font-semibold text-white">Click to upload</span> or drag and drop a video
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="px-2 py-1 rounded bg-black/40 border border-[#2b2b2b]">MP4</span>
              <span>Max size 50MB</span>
            </div>
            {file && (
              <>
                <div className="mt-4 px-3 py-2 rounded-lg bg-black/30 border border-[#2b2b2b]">
                  <p className="text-white text-sm md:text-base font-semibold truncate max-w-[70vw] md:max-w-[40vw]">{file.name}</p>
                  <p className="text-gray-400 text-xs mt-1">{size}</p>
                </div>
                {loading && (
                  <div className="w-[220px] h-2 mt-4 bg-[#2b2b2b] rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-[#E50914] to-[#B20710] animate-pulse" />
                  </div>
                )}
              </>
            )}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            ref={inputRef}
          />
        </label>
      </div>
      <div className="flex space-x-5 h-20">
        {file && (
          <>
            <button
              className="mt-10 px-5 py-2 rounded-lg btn-secondary"
              onClick={resetForm}
            >
              Reset
            </button>
            <button
              onClick={loading ? undefined : finalUpload}
              className="flex justify-center items-center min-w-[140px] mt-10 px-5 py-2 rounded-lg btn-primary"
            >
              {loading ? (
                <svg
                  viewBox="0 0 1024 1024"
                  fill="white"
                  className="w-6 h-6 animate-spin"
                >
                  <path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3s-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.8 83.9-162.7 109.7-63.1 26.8-130.2 40.3-199.3 40.3z" />
                </svg>
              ) : (
                "Upload"
              )}
            </button>
          </>
        )}
      </div>
      <div className="mt-6 text-xs text-gray-500 text-center">
        Your file stays private. We only process it to generate streaming renditions.
      </div>
    </div>
  );
}

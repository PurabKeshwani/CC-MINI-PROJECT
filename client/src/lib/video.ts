import axios from "axios";
import { BASE_URL } from "./constants";
import { validateComment, validateVideo, Video } from "../types/video";

export async function getVideo(id: string) {
  const res = await axios.get(BASE_URL + "/api/video/" + id, {
    withCredentials: true,
  });
  const vidoe = validateVideo.safeParse(res.data.video);
  if (vidoe.success) {
    return vidoe.data;
  }
  console.error(vidoe.error.errors);
  return null;
}

export async function getVideos() {
  const res = await axios.get(BASE_URL + "/api/video", {
    withCredentials: true,
  });
  const videosResponse: Video[] = [];

  for (const video of res.data.videos) {
    const parsedVideo = validateVideo.safeParse(video);
    if (parsedVideo.success) {
      videosResponse.push(parsedVideo.data);
    } else {
      console.error(parsedVideo.error.errors);
    }
  }

  return videosResponse;
}

export async function uploadFIle(file: File) {
  const formdata = new FormData();
  formdata.append("video", file, file.name);
  formdata.append("fileName", file.name);
  const res = await axios.post(BASE_URL + "/api/video", formdata, {
    withCredentials: true,
  });
  return res.data;
}

export async function updateVideo(id: string, video: Partial<Video>) {
  const res = await axios.patch(BASE_URL + "/api/video/" + id, video, {
    withCredentials: true,
  });
  return res.data;
}

export async function deleteVideo(id: string) {
  const res = await axios.delete(BASE_URL + "/api/video/" + id, {
    withCredentials: true,
  });
  return res.data;
}

export async function addComment(id: string, content: string) {
  const res = await axios.post(
    BASE_URL + "/api/video/" + id + "/comments",
    { content },
    {
      withCredentials: true,
    }
  );
  const data = res.data.comment;
  const parsedComment = validateComment.safeParse(data);
  if (parsedComment.success) {
    return parsedComment.data;
  }
  return null;
}

export async function deleteComment(videoID: string, commentID: number) {
  const res = await axios.delete(
    BASE_URL + "/api/video/" + videoID + "/comments/" + commentID,
    {
      withCredentials: true,
    }
  );
  return res.data;
}

export async function getVideoStatus(id: string) {
  const res = await axios.get(BASE_URL + "/api/video/" + id + "/status", {
    withCredentials: true,
  });
  return res.data as { ready: boolean; percent: number; objectCount: number; message: string };
}
import axios from "axios";
import { BASE_URL } from "./constants";
import { validateVideo, Video } from "../types/video";

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

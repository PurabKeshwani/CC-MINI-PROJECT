import { atom } from "recoil";
import { Video } from "../types/video";

export const videosAtom = atom<Video[]>({
  key: "videos",
  default: [],
});

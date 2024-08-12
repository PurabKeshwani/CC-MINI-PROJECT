import axios from "axios";
import { BASE_URL } from "./constants";

export async function uploadFIle(file: File) {
  const formdata = new FormData();
  formdata.append("video", file, file.name);
  formdata.append("fileName", file.name);
  const res = await axios.post(BASE_URL + "/api/video", formdata, {
    withCredentials: true,
  });
  return res.data;
}

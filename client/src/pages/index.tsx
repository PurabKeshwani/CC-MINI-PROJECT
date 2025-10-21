import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import auth from "./Auth";
import Upload from "./Upload";
import StudioVideo from "./StudioVideo";
import Studio from "./Studio";
import Video from "./Video";
import Analytics from "./Analytics";

export default function index() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:id" element={<Video />} />
      <Route path="/login" element={auth("login")} />
      <Route path="/register" element={auth("register")} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/studio" element={<Studio />} />
      <Route path="/studio/:id" element={<StudioVideo />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
}

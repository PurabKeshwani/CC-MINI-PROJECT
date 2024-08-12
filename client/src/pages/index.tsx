import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import auth from "./Auth";
import Upload from "./Upload";

export default function index() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={auth("login")} />
      <Route path="/register" element={auth("register")} />
      <Route path="/upload" element={<Upload />} />
    </Routes>
  );
}

import { Router } from "express";
import {
  handleDeleteVideo,
  handleGetVideo,
  handleGetVideos,
  handleUpdateVideo,
  handleUploadVideo,
} from "../controllers/video";
import upload, { handleMulterErrors } from "../lib/multerConfig";
import { checkToken } from "../middleware";

const router = Router();

router.get("/", handleGetVideos);
router.get("/:id", handleGetVideo);

router.use(checkToken);

router.post("/", upload.single("video"), handleMulterErrors, handleUploadVideo);
router.patch("/:id", handleUpdateVideo);
router.delete("/:id", handleDeleteVideo);

export default router;

import { Router } from "express";
import {
  handleAddComment,
  handleDeleteComment,
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
router.post("/:id/comments", handleAddComment);
router.delete("/:id/comments/:commentId", handleDeleteComment);

export default router;

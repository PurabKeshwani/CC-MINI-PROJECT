import { Router } from "express";
import { handleUploadVideo } from "../controllers/video";
import upload, { handleMulterErrors } from "../lib/multerConfig";
import { checkToken } from "../middleware";

const router = Router();

router.use(checkToken);

router.post("/", upload.single("video"), handleMulterErrors, handleUploadVideo);

export default router;

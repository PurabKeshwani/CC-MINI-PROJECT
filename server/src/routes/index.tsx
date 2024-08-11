import { Router } from "express";

import vieoRouter from "./video";
import authRouter from "./auth";

const router= Router();

router.use("/api/video", vieoRouter);
router.use("/api/auth", authRouter);

export default router;
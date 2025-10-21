import { Router } from "express";

import vieoRouter from "./video";
import authRouter from "./auth";
import analyticsRouter from "./analytics";

const router= Router();

router.use("/api/video", vieoRouter);
router.use("/api/auth", authRouter);
router.use("/api/analytics", analyticsRouter);

export default router;
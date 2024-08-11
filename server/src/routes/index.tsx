import { Router } from "express";

import vieoRouter from "./video";

const router= Router();

router.use("/api/video", vieoRouter);

export default router;
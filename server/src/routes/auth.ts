import { Router } from "express";
import { handleLoginUser, handleSignupUser } from "../controllers/auth";

const authRouter = Router();

authRouter.post("/register", handleSignupUser);
authRouter.post("/login", handleLoginUser);

export default authRouter;

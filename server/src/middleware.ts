import { NextFunction, Request, Response } from "express";
import { decodeToken } from "./lib/pass";
import prisma from "./lib/prisma";

export async function checkToken(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  const token = req.cookies.token;

  if (!token) {
    return resp.status(401).send({
      message: "Unauthorized Access, Please login to continue",
      status: "failed",
    });
  }
  try {
    const { username } = decodeToken(token);
    const userExists = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (!userExists) {
      return resp.status(401).send({
        message: "Unauthorized Access, Please login to continue",
        status: "failed",
      });
    }
    resp.locals.user = userExists;
    next();
  } catch (error) {
    return resp.status(401).send({
      message: "Unauthorized Access, Please login to continue",
      status: "failed",
    });
  }
}

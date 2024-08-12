import fs from "fs";
import multer from "multer";
import { UPLOADS_DIR } from "./constants";
import { NextFunction, Request, Response } from "express";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR);
    }
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname;
    req.body.fileNameComputed = fileName;
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "video/mp4") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

export async function handleMulterErrors(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}

export default upload;

import { Request, Response } from "express";
import multer from "multer";

// stores file on disk
const fileStorage = multer.diskStorage({
  destination: "images",
  filename: (req: Request, file: any, cb: Function) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req: Request, file: any, cb: Function) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export default multer({ storage: fileStorage, fileFilter: fileFilter }).any();

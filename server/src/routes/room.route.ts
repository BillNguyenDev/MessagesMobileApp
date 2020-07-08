import express from "express";
import {
  createRoom,
  getListRoom,
  getMessages,
} from "../controllers/room.controller";
import multerConfig from "../configuration/multerConfig";
import { authenticateToken } from "../controllers/user.controller";

const router = express.Router();

router.post("/create", multerConfig, createRoom);
router.get("/getmessages", authenticateToken, getMessages);
// for dev
router.get("/getlistroom", getListRoom);
export default router;

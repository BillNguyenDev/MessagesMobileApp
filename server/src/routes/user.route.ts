import express from "express";

import {
  login,
  logout,
  getInfo,
  register,
  getListUsers,
  addUser,
  getNewToken,
  authenticateToken,
  getListFriend,
} from "../controllers/user.controller";

import update from "./update.user.route";
const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/getinfo", getInfo);
router.post("/register", register);
router.post("/token", getNewToken);
router.get("/getlistfriend", authenticateToken, getListFriend);
router.use("/update", update);
//dev
router.get("/getlistusers", getListUsers);
router.post("/adduser", addUser);

export default router;

import express from "express";
import multerConfig from "../configuration/multerConfig";
import {
  account,
  password,
  social,
  addFriend,
} from "../controllers/update.user.controller";

const router = express.Router();

router.post("/account", multerConfig, account);
router.post("/password", password);
router.post("/social", social);
router.post("/addfriend", addFriend);

export default router;

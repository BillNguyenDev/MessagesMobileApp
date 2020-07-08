import express from "express";
import { searchFriend } from "../controllers/search.controller";
import { authenticateToken } from "../controllers/user.controller";

const router = express.Router();

router.post("/listfriend", authenticateToken, searchFriend);

// for dev

export default router;

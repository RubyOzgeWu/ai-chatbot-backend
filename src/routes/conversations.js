import express from "express";
import content from "../middleware/content.js";
import * as auth from "../middleware/auth.js";

import {
  createConversation,
  readConversations,
  readConversation,
  deleteConversations,
} from "../controllers/conversation.js";

const router = express.Router();

router.post("/", content("application/json"), createConversation);
router.get("/all", readConversations); // 取得所有對話
router.get("/:session_id", readConversation); // 取得單一對話
router.delete("/all", deleteConversations);
// router.get('/user/:user_id', auth.jwt, readConversations);
// router.delete('/user/:user_id', auth.jwt, deleteConversations);
export default router;

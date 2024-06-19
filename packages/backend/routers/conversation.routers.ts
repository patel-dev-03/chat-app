import express from "express";
import * as conversationController from "../controllers/conversation.controllers";

const router = express.Router();

router.get("/:userId",conversationController.getAllConversationUser)



export default router;


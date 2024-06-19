import express from "express";
import * as messageController from "../controllers/message.controllers";

const router = express.Router();

router.get("/", messageController.getMessage);
router.post("/", messageController.createMessage);
    
router.delete("/", messageController.deleteMessage);
router.get("/latestMessage/", messageController.getLatestMessage);

export default router;

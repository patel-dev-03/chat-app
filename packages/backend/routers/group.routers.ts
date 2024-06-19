import express from "express";
import * as groupController from "../controllers/group.controllers";

const router = express.Router();

router.post("/createGroup/:userId", groupController.createGroup);
router.get("/:userId", groupController.getGroups);
router.post("/groupMember/:groupId", groupController.createGroupMembers);
router.delete("/groupMember/:groupMemberId", groupController.deleteGroupMember);

router.get("/nonGroupMember/:groupId", groupController.getNonGroupMembers);
router.delete("/", groupController.deleteGroup);
export default router;

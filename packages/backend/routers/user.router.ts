import express from "express";
import * as userController from "../controllers/user.controller";
import { loginPerson } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", userController.createUser);
router.get("/:clerkId", loginPerson, userController.getUser);
router.put("/:clerkId", loginPerson, userController.updateUser);

export default router;

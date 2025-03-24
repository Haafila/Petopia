import express from "express";
import * as userController from "../controllers/user.controller.js";
import upload from "../utils/upload.js";
const router = express.Router();

router.post("/", upload.single("image"), userController.createUser);
router.put("/:id", upload.single("image"), userController.updateUser);
router.get("/:id", userController.getUserById);
router.delete("/:id", userController.deleteUser);
router.get("/", userController.getAllUsers);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
export default router;

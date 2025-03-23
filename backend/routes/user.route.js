import express from "express";
import * as userController from "./controller.js";
import upload from "../../utils/upload.js";
const router = express.Router();

router.post("/users", upload.single("image"), userController.createUser);
router.put("/users/:id", upload.single("image"), userController.updateUser);
router.get("/users/:id", userController.getUserById);
router.delete("/users/:id", userController.deleteUser);
router.get("/users", userController.getAllUsers);
router.post("/users/login", userController.loginUser);
export default router;

import express from "express";
import * as petController from "./controller.js";

import upload from "../../utils/upload.js";
const router = express.Router();

router.post("/pets", upload.single("image"), petController.createPet);
router.put("/pets/:id", upload.single("image"), petController.updatePet);
router.get("/pets/:id", petController.getPetById);
router.delete("/pets/:id", petController.deletePet);
router.get("/pets", petController.getAllPets);
router.get("/pets/owner/:ownerId", petController.getPetsByOwner);

export default router;

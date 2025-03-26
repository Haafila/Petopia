import express from "express";
import paymentController from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", paymentController.createPayment);
router.get("/", paymentController.getAllPayments);
router.get("/:id", paymentController.getPaymentById);
router.put("/:id", paymentController.updatePayment);

export default router;

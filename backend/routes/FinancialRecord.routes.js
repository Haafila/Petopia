import express from 'express';

import { 
  createFinancialRecord, 
  deleteFinancialRecord, 
  getFinancialRecord, 
  getFinancialRecords, 
  updateFinancialRecord 
} from "../controllers/financialRecord.controller.js";

const router = express.Router();


router.get("/", getFinancialRecords);


router.get("/:id", getFinancialRecord);

router.post("/", createFinancialRecord);

router.put("/:id", updateFinancialRecord);

router.delete("/:id", deleteFinancialRecord);

export default router;

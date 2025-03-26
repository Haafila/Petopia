import mongoose from "mongoose";
import FinancialRecord from "../models/financial-record.model.js";

// Fetch all financial records
export const getFinancialRecords = async (req, res) => {
  try {
    const records = await FinancialRecord.find({});
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    console.log("Error in fetching financial records:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Fetch a single financial record by ID
export const getFinancialRecord = async (req, res) => {
  const { id } = req.params;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Financial Record Id" });
  }

  try {
    const record = await FinancialRecord.findById(id);

    // Check if the record exists
    if (!record) {
      return res.status(404).json({ success: false, message: "Financial Record not found" });
    }

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    console.log("Error in fetching financial record:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new financial record
export const createFinancialRecord = async (req, res) => {
  const { userId, date, description, amount } = req.body;

  // Ensure all required fields are provided
  if (!userId || !date || !description || !amount) {
    return res.status(400).json({ success: false, message: "Please provide the necessary fields" });
  }

  const newRecord = new FinancialRecord({ userId, date, description, amount });

  try {
    await newRecord.save();
    res.status(201).json({ success: true, data: newRecord });
  } catch (error) {
    console.error("Error in creating financial record:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update an existing financial record by ID
export const updateFinancialRecord = async (req, res) => {
  const { id } = req.params;
  const { userId, date, description, amount } = req.body;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Financial Record Id" });
  }

  try {
    const updatedRecord = await FinancialRecord.findByIdAndUpdate(id, { userId, date, description, amount }, {
      new: true,
      runValidators: true
    });

    if (!updatedRecord) return res.status(404).json({ success: false, message: "Record not found" });

    res.status(200).json({ success: true, data: updatedRecord });
  } catch (error) {
    console.log("Error in updating financial record:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a financial record by ID
export const deleteFinancialRecord = async (req, res) => {
  const { id } = req.params;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Financial Record Id" });
  }

  try {
    await FinancialRecord.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Financial record deleted" });
  } catch (error) {
    console.log("Error in deleting financial record:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

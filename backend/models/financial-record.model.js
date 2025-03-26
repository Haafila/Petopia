import mongoose from "mongoose";

const financialRecordSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    date: { 
      type: Date, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
  },
  {
    timestamps: true, 
  }
);

const FinancialRecord = mongoose.model("FinancialRecord", financialRecordSchema);

export default FinancialRecord;

import mongoose from 'mongoose';
const { Schema } = mongoose;

const petSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  image: { type: String }, // store filename if user uploads
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Pet = mongoose.model('Pet', petSchema);
export default Pet;
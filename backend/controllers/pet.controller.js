import Pet from '../models/pet.model';
import multer from 'multer';
import path from 'path';

// Setup multer for pet image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
export const uploadPet = multer({ storage });

// Get all pets for a user
export const getUserPets = async (req, res) => {
  try {
    // Make sure user can only see their own pets
    const pets = await Pet.find({ owner: req.user._id });
    return res.status(200).json({ success: true, pets });
  } catch (error) {
    console.error("Get User Pets Error:", error);
    return res.status(500).json({ success: false, error: "Get pets server error" });
  }
};

// Add a new pet
export const addPet = async (req, res) => {
  try {
    const { name, dob, gender } = req.body;
    const newPet = new Pet({
      owner: req.user._id,
      name,
      dob,
      gender
    });
    if (req.file) {
      newPet.image = req.file.filename;
    }
    await newPet.save();
    return res.status(200).json({ success: true, message: "Pet added", pet: newPet });
  } catch (error) {
    console.error("Add Pet Error:", error);
    return res.status(500).json({ success: false, error: "Add pet server error" });
  }
};

// Get single pet (to view)
export const getPet = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ success: false, error: "Pet not found" });
    }
    // Make sure the pet belongs to the current user
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }
    return res.status(200).json({ success: true, pet });
  } catch (error) {
    console.error("Get Pet Error:", error);
    return res.status(500).json({ success: false, error: "Get pet server error" });
  }
};

// Update pet
export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dob, gender } = req.body;

    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ success: false, error: "Pet not found" });
    }
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    // Update fields
    pet.name = name;
    pet.dob = dob;
    pet.gender = gender;
    if (req.file) {
      pet.image = req.file.filename;
    }
    await pet.save();

    return res.status(200).json({ success: true, message: "Pet updated", pet });
  } catch (error) {
    console.error("Update Pet Error:", error);
    return res.status(500).json({ success: false, error: "Update pet server error" });
  }
};

// Delete pet
export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ success: false, error: "Pet not found" });
    }
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }
    await Pet.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Delete Pet Error:", error);
    return res.status(500).json({ success: false, error: "Delete pet server error" });
  }
};
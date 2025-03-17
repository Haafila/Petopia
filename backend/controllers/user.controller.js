import User from '../models/user.model';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store images in server/public/uploads
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
export const upload = multer({ storage });

// View user details
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({ success: false, error: "Get user server error" });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    const { name, phone, email, address } = req.body;
    const updateData = { name, phone, email, address };

    // If user uploaded an image, add to update data
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User updated", user: updatedUser });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({ success: false, error: "Update user server error" });
  }
};

// (Optional) Change password example
export const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ success: false, error: "Incorrect old password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed" });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({ success: false, error: "Change password server error" });
  }
};
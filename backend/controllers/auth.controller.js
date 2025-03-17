import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model';

export const register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword
    });
    await newUser.save();

    return res.status(200).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, error: "Registration server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, error: "Incorrect password" });
    }

    // Generate JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: "10d" });

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, error: "Login server error" });
  }
};

export const verify = (req, res) => {
  // If we get here, user was found and attached by authMiddleware
  return res.status(200).json({ success: true, user: req.user });
};
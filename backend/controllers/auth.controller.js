import User from "../models/user.model.js"; // Import the User model

// Controller for /login route
export const login = (req, res) => {
  const user = {
    _id: "67d7dda581850a0c88ab9b77",
    name: "John Doe",
    email: "john.doe@example.com",
  };

  req.session.user = user;
  console.log("User data saved in session:", req.session.user); // Debug log

  res.json({ message: "User data saved in session", user: req.session.user });
};

// Controller for /profile route
export const profile = (req, res) => {
  // Debug: Log the entire session and user data
  console.log("Session data:", req.session);
  console.log("User data:", req.session.user);

  // Check if user data exists in session
  if (!req.session.user || !req.session.user._id) {
    const userId = req.session.user?._id ? req.session.user._id.toString() : "not available";
    console.log(`Debug: User ID in session - ${userId}`);
    return res.status(401).json({
      error: `Unauthorized: User not found. User ID: ${userId}`,
    });
  }

  // If user data exists, proceed
  res.json({ message: "User profile", user: req.session.user });
};

export const register = async (req, res) => {
  console.log("Register route hit"); // Debug: Check if the route is being called
  console.log("Request Body:", req.body); // Debug: Log the request body

  try {
    const { name, email, password, role } = req.body; // Extract role from request body
    console.log("Extracted Data:", { name, email, password, role }); // Debug: Log extracted data

    const user = new User({ name, email, password, role }); // Include role in the user object
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error("Error registering user:", error.message); // Log the error for debugging
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./src/middlewares/userauth.middleware");
const User = require("./src/models/User");
const app = express();

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const TOKEN_EXPIRATION = "1h";

// Zod schemas for validation
const userSchema = zod.object({
  name: zod.string(),
  email: zod.string().email(),
  password: zod.string().min(8),
});

const signinBody = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

// Signup route
app.post("/signup", async (req, res) => {
  const input = req.body;

  // Validate input
  const valid = userSchema.safeParse(input);
  if (!valid.success) {
    return res.status(400).json({
      result: false,
      error: valid.error.issues,
      message: "Invalid input data. Please provide valid name, email, and password.",
    });
  }

  try {
    // Check if the user already exists
    let user = await User.findOne({ email: input.email });
    if (user) {
      // Generate token for existing user
      const token = user.generateToken();
      return res.status(200).json({
        result: true,
        error: null,
        message: "User already exists. Token generated.",
        token,
      });
    }

    // Create a new user
    user = new User({
      name: input.name,
      email: input.email,
      password: input.password,
    });

    // Save the user to the database
    await user.save();

    // Generate token for the new user
    const token = user.generateToken();
    return res.status(201).json({
      result: true,
      error: null,
      message: "User created successfully.",
      token,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    return res.status(500).json({
      result: false,
      error: error.message,
      message: "Internal server error.",
    });
  }
});

// Signin route
app.post("/signin", async (req, res) => {
  const input = req.body;

  // Validate input
  const valid = signinBody.safeParse(input);
  if (!valid.success) {
    return res.status(400).json({
      result: false,
      error: valid.error.issues,
      message: "Invalid input data. Please provide a valid email and password.",
    });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email: input.email });
    if (!user) {
      return res.status(404).json({
        result: false,
        error: "User not found.",
        message: "Invalid email or password.",
      });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await user.comparePassword(input.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        result: false,
        error: "Incorrect password.",
        message: "Invalid email or password.",
      });
    }

    // Generate a token for the authenticated user
    const token = user.generateToken();
    return res.status(200).json({
      result: true,
      error: null,
      message: "Signin successful.",
      token,
    });
  } catch (error) {
    console.error("Error during signin:", error.message);
    return res.status(500).json({
      result: false,
      error: error.message,
      message: "Internal server error.",
    });
  }
});

// Middleware-protected update route
app.put("/update", authMiddleware, (req, res) => {
  return res.status(200).json({
    result: true,
    error: null,
    message: "User updated successfully.",
  });
});

// Middleware-protected delete route
app.delete("/user/delete", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `authMiddleware` attaches the user object
    await User.findByIdAndDelete(userId);
    return res.status(200).json({
      result: true,
      error: null,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      result: false,
      error: error.message,
      message: "Error deleting user.",
    });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

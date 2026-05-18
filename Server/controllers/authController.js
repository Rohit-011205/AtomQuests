import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper to generate JWT including role for RBAC
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, managerId, department } = req.body;

    // 1. Validate mandatory roles defined in Section 3 

    const normalizedRole = role.trim().toLowerCase();
    const validRoles = ["employee", "manager", "admin"];
    if (!validRoles.includes(normalizedRole)) {
      return res.status(400).json({
        message: "Invalid role assigned. Must be Employee, Manager (L1), or Admin / HR."
      });
    }
    

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Validate Manager existence if role is Employee [cite: 40]
    if (role === "employee" && managerId) {
      const manager = await User.findById(managerId);
      if (!manager || manager.role !== "manager") {
        return res.status(400).json({ message: "Invalid manager assignment" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      managerId: managerId || null,
      department: department || "General"
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        managerId: user.managerId,
        department: user.department
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use .select("+password") if your model hides password by default
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        managerId: user.managerId,
        department: user.department
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    // Return full user context for the frontend dashboard [cite: 43]
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user data", error: error.message });
  }
};
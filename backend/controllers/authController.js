import User from "../models/User.js";
import jwt from "jsonwebtoken";

//  Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//  REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password, adminSecret } = req.body;

  try {
    // validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // role logic
    let role = "user";
    if (adminSecret && adminSecret === process.env.ADMIN_SECRET) {
      role = "admin";
    }

    // create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
    });

    // response (IMPORTANT FORMAT 🔥)
    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

//  LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // find user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // match password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // success response
    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

//  UPDATE USER
export const updateUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // email update
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email.toLowerCase();
    }

    // name update
    if (name) user.name = name;

    // password update
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password too short" });
      }
      user.password = password;
    }

    await user.save();

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT (optional)
export const logoutUser = (req, res) => {
  res.json({ message: "Logout successful" });
};

const expressAsyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/generateToken");
const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    return res.json({ _id: user._id, name: user.name, email: user.email });
  }
  res.status(401);
  throw new Error("Invalid email or password");
});
const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const checkUser = await User.findOne({ email });
  if (checkUser) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    generateToken(res, user._id);
    return res
      .status(201)
      .json({ _id: user._id, name: user.name, email: user.email });
  }
  res.status(400);
  throw new Error("Invalid credential(s)");
});
const logoutUser = expressAsyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  res.status(201).json({ message: "Logged out successfully" });
});
const getUserProfile = expressAsyncHandler(async (req, res) => {
  if (req.user)
    return res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  else {
    res.status(404);
    throw new Error("User not found");
  }
});
const updateUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;
    if (req.body.password) user.password = req.body.password;
    const updatedUser = await user.save();
    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
module.exports = {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};

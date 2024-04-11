const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const expressAsyncHandler = require("express-async-handler");
require("dotenv").config();
const protect = expressAsyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (err) {
      res.status(401);
      throw new Error("Unauthorized acces, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Unauthorized access, no token");
  }
});
module.exports = { protect };

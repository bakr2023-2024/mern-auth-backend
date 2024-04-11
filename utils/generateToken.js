const jwt = require("jsonwebtoken");
require("dotenv").config();
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.TOKEN_SECRET);
  res.cookie("jwt", token, {});
};
module.exports = { generateToken };

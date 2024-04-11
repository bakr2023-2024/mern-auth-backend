require("dotenv").config();
const notFound = (req, res, next) => {
  const err = new Error("not found: " + req.originalUrl);
  res.statusCode = 404;
  next(err);
};
const errHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
module.exports = { notFound, errHandler };

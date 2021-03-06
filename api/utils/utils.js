const jwt = require("jsonwebtoken");

function response({ statusCode, message, data }) {
  return {
    statusCode,
    message,
    data,
  };
}

function resolveFilePath(filePath) {
  return filePath.toString().replace(/\\/i, "/");
}

function generateAccessToken(_id) {
  try {
    return jwt.sign({ _id }, process.env.JWT_KEY, { expiresIn: "12h" });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  response,
  resolveFilePath,
  generateAccessToken,
};

const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

// middleware to verify the token and store user data in req.user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized! Token missing!" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized! Invalid token!" });
  }
};

module.exports = authenticateToken;

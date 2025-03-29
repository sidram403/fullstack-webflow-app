import jwt from 'jsonwebtoken'

export  const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // Check if token is provided and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied" });
  }

  // Extract the token by removing "Bearer " prefix
  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

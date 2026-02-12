import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };
    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired"
      });
    }

    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token found, access denied!" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decodedToken.userId, role: decodedToken.role };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Session expire or invalid token!" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required!" });
  }
  next();
};

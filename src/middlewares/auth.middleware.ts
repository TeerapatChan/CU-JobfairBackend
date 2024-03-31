import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}
const JWT_SECRET = process.env.JWT_SECRET || "";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token || token === "null") {
    return res
      .status(401)
      .json({ success: false, message: "Not authorize to access this route" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ success: false, message: "Not authorize to access this route" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorize to access this route",
      });
    }
    next();
  };
};

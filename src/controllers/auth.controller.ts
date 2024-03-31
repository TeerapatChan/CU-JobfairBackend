import User, { IUser } from "../models/User";
import { CookieOptions, Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, tel, email, password } = req.body;
    const user = new User({ name, tel, email, password });

    const existing = await User.findOne({
      email: email,
    });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await user.save();
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({
      email: email,
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};

export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);

  res.status(200).json({
    success: true,
    data: user,
  });
};

const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  const token = user.getSignedJwtToken();
  const options: CookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
};

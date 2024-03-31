import { S3 } from "aws-sdk";
import { Request, Response } from "express";
import User from "../models/User";

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});
const bucketName = process.env.BUCKET_NAME || "";

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const file = req.file;
  const params = {
    Bucket: bucketName,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ContentDisposition: "inline",
  };

  s3.upload(params, async (err: Error, data: S3.ManagedUpload.SendData) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ message: "Error uploading file" });
    }

    try {
      const user = await User.findById(req.user?._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.profileImageUrl = data.Location;
      await user.save();

      console.log("Profile Image uploaded successfully:", data.Location);
      return res.status(200).json({
        message: "Profile Image uploaded successfully",
        url: data.Location,
      });
    } catch (error) {
      console.error("Error storing file URL in user schema:", error);
      return res
        .status(500)
        .json({ message: "Error storing file URL in user schema" });
    }
  });
};

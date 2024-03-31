import { S3 } from "aws-sdk";

export const checkBucket = async () => {
  const bucket = process.env.BUCKET_NAME || "";

  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  try {
    const res = await s3.headBucket({ Bucket: bucket }).promise();

    console.log("Bucket already Exist", res.$response.data);

    return { success: true, message: "Bucket already Exist", data: {} };
  } catch (error) {
    console.log("Error bucket don't exist", error);

    return { success: false, message: "Error bucket don't exist", data: error };
  }
};

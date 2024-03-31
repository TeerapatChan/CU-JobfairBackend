import mongoose from "mongoose";

export async function connectToDatabase(mongodbUri: string) {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongodbUri);
    console.log("MongoDB is connected");
  } catch (error) {
    console.log(error);
  }
}

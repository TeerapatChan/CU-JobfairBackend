import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectToDatabase } from "./config/database";

dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT;

const MONGODB_URI = process.env.MONGODB_URI || "";

connectToDatabase(MONGODB_URI);

app.listen(PORT, () => console.log(`Server is starting at port ${PORT}`));

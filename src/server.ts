import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet, { xssFilter } from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import { connectToDatabase } from "./config/database";
import authRouter from "./routes/auth.router";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xssFilter());
app.use(hpp());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use("/api/auth", authRouter);

const PORT = process.env.PORT;

const MONGODB_URI = process.env.MONGODB_URI || "";

connectToDatabase(MONGODB_URI);

app.listen(PORT, () => console.log(`Server is starting at port ${PORT}`));

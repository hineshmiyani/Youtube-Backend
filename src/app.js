import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ENV from "./env";

const app = express();

app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

export { app };

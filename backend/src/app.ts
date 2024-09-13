import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import ErrorMiddleware from "./middlewares/error";
import userRoutes from "./routes/user-routes";
import externalRoutes from "./routes/external-api-routes";

dotenv.config();

const options = { origin: true, credentials: true };

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors(options));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", userRoutes, externalRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "API is working!",
    success: true,
  });
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error("Route not found");
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);

export default app;

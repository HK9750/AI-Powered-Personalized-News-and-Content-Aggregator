import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import ErrorMiddleware from "./middlewares/error";
import userRoutes from "./routes/user-routes";
import externalRoutes from "./routes/external-api-routes";
import adminAnalyticsRoutes from "./routes/admin-analytics-routes";
import contentRoutes from "./routes/content-routes";
import bookmarkRoutes from "./routes/bookmark-routes";
import DashboardConfigRoutes from "./routes/dashboard-config-routes";
import notificationRoutes from "./routes/notification-routes";
import ReadingHistoryRoutes from "./routes/reading-history-routes";

dotenv.config();

const options = { origin: true, credentials: true };

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors(options));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/external", externalRoutes);
app.use("/api/v1/admin-analytics", adminAnalyticsRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/bookmark", bookmarkRoutes);
app.use("/api/v1/dashboard-config", DashboardConfigRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/reading-history", ReadingHistoryRoutes);

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

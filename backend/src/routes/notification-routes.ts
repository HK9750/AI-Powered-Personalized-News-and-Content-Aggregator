import express from "express";
import { NotificationApi } from "../api/NotificationApi";

const notificationApi = new NotificationApi();

const router = express.Router();

router.get("/users", notificationApi.getNotificationsByUser);

export default router;

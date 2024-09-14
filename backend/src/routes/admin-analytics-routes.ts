import express from "express";
import { AdminAnalyticsApi } from "../api/adminAnalyticsApi";

const adminAnalyticsApi = new AdminAnalyticsApi();

const router = express.Router();

router.post("/create", adminAnalyticsApi.createAdminAnalytics);
router.get("/content/:contentId", adminAnalyticsApi.getAnalyticsForContent);
router.put("/update/:id", adminAnalyticsApi.updateAdminAnalytics);
router.delete("/delete/:id", adminAnalyticsApi.deleteAdminAnalytics);

export default router;

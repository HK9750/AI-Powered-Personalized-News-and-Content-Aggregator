import express from "express";
import { ReadingHistoryApi } from "../api/readingHistoryApi";

const readingHistoryApi = new ReadingHistoryApi();

const router = express.Router();

router.get("/users/:userId", readingHistoryApi.getReadingHistoryByUser);
router.post("/upsert", readingHistoryApi.createOrUpdateReadingHistory);
router.delete("/delete/:userId", readingHistoryApi.deleteReadingHistory);

export default router;

import express from "express";
import { ContentApi } from "../api/contentApi";

const contentApi = new ContentApi();

const router = express.Router();

router.get("/news", contentApi.getNews);
router.post("/podcast", contentApi.getPodcasts);
router.put("/recommendations", contentApi.getRecommendedContent);
router.delete("/youtube", contentApi.getYouTubeVideos);

export default router;

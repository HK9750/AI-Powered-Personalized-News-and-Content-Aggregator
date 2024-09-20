import express from "express";
import { ExternalApi, RecommendationApi } from "../api/externalApi";

const router = express.Router();

const externalapi = new ExternalApi();
const recommendationapi = new RecommendationApi();

router.post("/youtube", externalapi.getYouTubeVideos);
router.post("/news", externalapi.getNews);
router.post("/podcasts", externalapi.getPodcasts);
router.post("/recommendations", recommendationapi.getRecommendations);

export default router;

import express from "express";
import { ExternalApi } from "../api/externalApi";

const router = express.Router();

const externalapi = new ExternalApi();

router.post("/youtube", externalapi.getYouTubeVideos);
router.post("/news", externalapi.getNews);
router.post("/podcasts", externalapi.getPodcasts);
router.post("/recommendations", externalapi.getRecommendations);

export default router;

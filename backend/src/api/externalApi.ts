import axios from "axios";
import AsyncErrorHandler from "../utils/asyncErrorHandler";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export class ExternalApi {
  youtubeApiKey: string | undefined;
  newsApiKey: string | undefined;
  podcastIndexApiKey: string | undefined;
  podcastIndexSecret: string | undefined;
  openAiApiKey: string | undefined;

  constructor() {
    this.youtubeApiKey = process.env.YOUTUBE_API_KEY;
    this.newsApiKey = process.env.NEWS_API_KEY;
    this.podcastIndexApiKey = process.env.PODCAST_API_KEY;
    this.podcastIndexSecret = process.env.PODCAST_API_SECRET;
    this.openAiApiKey = process.env.OPENAI_API_KEY;
  }

  public getYouTubeVideos = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { query } = req.body;
      if (!query) {
        return next(new Error("Please enter a query"));
      }

      try {
        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              q: query,
              type: "video",
              key: this.youtubeApiKey,
              maxResults: 10,
              order: "relevance",
            },
          }
        );
        return res.status(200).json({
          success: true,
          message: "Videos fetched",
          videos: response.data.items,
        });
      } catch (error) {
        return next(new Error("Internal Server Error in getYouTubeVideos"));
      }
    }
  );

  public getNews = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { query } = req.body;
      if (!query) {
        return next(new Error("Please enter a query"));
      }

      try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: query,
            apiKey: this.newsApiKey,
            pageSize: 10,
          },
        });
        res.status(200).json({
          success: true,
          message: "News fetched",
          news: response.data.articles,
        });
      } catch (error) {
        return next(new Error("Internal Server Error in getNews"));
      }
    }
  );

  public getPodcasts = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { query } = req.body;
      if (!query) {
        return next(new Error("Please enter a query"));
      }

      try {
        const response = await axios.get(
          "https://api.podcastindex.org/api/1.0/search/byterm",
          {
            params: {
              q: query,
              key: this.podcastIndexApiKey,
              secret: this.podcastIndexSecret,
            },
          }
        );
        res.status(200).json({
          success: true,
          message: "Podcasts fetched",
          podcasts: response.data.feeds,
        });
      } catch (error) {
        return next(new Error("Internal Server Error in getPodcasts"));
      }
    }
  );

  public getRecommendations = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userPreferences } = req.body;
        if (!userPreferences) {
          return next(new Error("Please enter user preferences"));
        }
        const response = await axios.post("http://localhost:5000/recommend", {
          userContent: [userPreferences],
        });
        return res.status(200).json({
          success: true,
          message: "Recommendations fetched",
          recommendations: response.data.recommendations,
        });
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        throw new Error("Could not fetch recommendations");
      }
    }
  );
}

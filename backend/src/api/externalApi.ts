import axios from "axios";
import AsyncErrorHandler from "../utils/asyncErrorHandler";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import ErrorHandler from "../utils/errorHandler";
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

  public getYouTubeVideos = async (query: string) => {
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
    return response.data.items;
  };

  public getNews = async (query: string) => {
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: query,
        apiKey: this.newsApiKey,
        pageSize: 10,
      },
    });
    return response.data.articles;
  };

  public getPodcasts = async (query: string) => {
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

    return response.data.feeds;
  };
}

export class RecommendationApi {
  externalApi: ExternalApi;
  flaskApiUrl: string | undefined;

  constructor() {
    this.externalApi = new ExternalApi();
    this.flaskApiUrl = process.env.FLASK_BACKEND_URL;
  }

  public getRecommendations = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { query, preferences } = req.body;

        if (!query) {
          return next(new ErrorHandler("Query is required", 400));
        }

        let youtubeData = [];
        let newsData = [];
        let podcastData = [];

        if (preferences.sources.includes("youtube")) {
          youtubeData = await this.externalApi.getYouTubeVideos(query);
        }

        if (preferences.sources.includes("news")) {
          newsData = await this.externalApi.getNews(query);
        }

        if (preferences.sources.includes("podcasts")) {
          podcastData = await this.externalApi.getPodcasts(query);
        }

        const recommendationsResponse = await axios.post(
          `${this.flaskApiUrl}/recommend`,
          {
            youtubeData,
            newsData,
            podcastData,
            preferences,
          }
        );

        res.status(200).json({
          recommendations: recommendationsResponse.data,
        });
      } catch (error) {
        return next(
          new ErrorHandler("Internal Server Error in getRecommendations", 500)
        );
      }
    }
  );
}

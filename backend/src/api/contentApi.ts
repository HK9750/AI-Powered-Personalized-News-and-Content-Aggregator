import { Request, Response, NextFunction } from "express";
import { ExternalApi } from "./externalApi";
import AsyncErrorHandler from "../utils/asyncErrorHandler";
import ErrorHandler from "../utils/errorHandler";
import prisma from "../utils/prisma";

const externalApi = new ExternalApi();

export class ContentApi {
  private saveContent = async (
    contentData: any[],
    res: Response,
    source: string
  ) => {
    try {
      await prisma.content.createMany({ data: contentData });
    } catch (error) {
      return new ErrorHandler(`Error saving ${source} content`, 500);
    }
  };

  public getYouTubeVideos = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response: any = externalApi.getYouTubeVideos(req, res, next);
        const videos = response.videos.map((video: any) => ({
          title: video.snippet.title,
          description: video.snippet.description,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          source: "YouTube",
          type: "VIDEO",
          topics: ["Technology"],
          publishedAt: new Date(video.snippet.publishedAt),
        }));

        await this.saveContent(videos, res, "YouTube");
      } catch (error) {
        return next(
          new ErrorHandler("Internal Server Error in getYouTubeVideos", 500)
        );
      }
    }
  );

  public getNews = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response: any = externalApi.getNews(req, res, next);
        const articles = response.articles.map((article: any) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          source: "News",
          type: "ARTICLE",
          topics: ["Technology"],
          publishedAt: new Date(article.publishedAt),
        }));

        await this.saveContent(articles, res, "News");
      } catch (error) {
        return next(new ErrorHandler("Internal Server Error in getNews", 500));
      }
    }
  );

  public getPodcasts = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response: any = externalApi.getPodcasts(req, res, next);
        const podcasts = response.podcasts.map((podcast: any) => ({
          title: podcast.title,
          description: podcast.description,
          url: podcast.url,
          source: "Podcast",
          type: "PODCAST",
          topics: ["Technology"],
          publishedAt: new Date(podcast.publishedAt),
        }));

        await this.saveContent(podcasts, res, "Podcasts");
      } catch (error) {
        return next(
          new ErrorHandler("Internal Server Error in getPodcasts", 500)
        );
      }
    }
  );

  public getRecommendedContent = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userPreferences } = req.body;
        if (!userPreferences) {
          return res
            .status(400)
            .json({ error: "Please provide user preferences" });
        }
        const response: any = externalApi.getRecommendations(req, res, next);
        const recommendations = response.recommendations.map(
          (recommendation: any) => ({
            userId: (req as any).user.id,
            contentId: recommendation.contentId,
            score: recommendation.score,
          })
        );

        await prisma.recommendation.createMany({ data: recommendations });
        res
          .status(200)
          .json({ message: "Recommendations saved successfully!" });
      } catch (error) {
        next(error);
      }
    }
  );
}

import { Request, Response, NextFunction } from "express";
import AsyncErrorHandler from "../utils/asyncErrorHandler";
import ErrorHandler from "../utils/errorHandler";
import prisma from "../utils/prisma";

export class AdminAnalyticsApi {
  public createAdminAnalytics = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId, contentId, engagementRate, views, bookmarks } =
          req.body;

        const analytics = await prisma.adminAnalytics.create({
          data: {
            userId,
            contentId,
            engagementRate,
            views,
            bookmarks,
          },
        });

        res.status(201).json({ message: "Admin Analytics created", analytics });
      } catch (error) {
        next(new Error("Failed to create analytics entry"));
      }
    }
  );

  public getAnalyticsForContent = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { contentId } = req.params;

        if (!contentId) {
          return new ErrorHandler(
            `Please give content Id to getAnalyticsForContent`,
            500
          );
        }

        const analytics = await prisma.adminAnalytics.findMany({
          where: { contentId },
        });

        res.status(200).json({ analytics });
      } catch (error) {
        next(new Error("Failed to fetch analytics for content"));
      }
    }
  );

  public updateAdminAnalytics = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const { engagementRate, views, bookmarks } = req.body;

        if (!id) {
          return next(
            new ErrorHandler("Id not found in updateAdminAnalytics", 400)
          );
        }

        if (!engagementRate || !views || !bookmarks) {
          return next(
            new ErrorHandler(
              "EngagementRate, Views, Bookmarks are missing",
              400
            )
          );
        }

        const updatedAnalytics = await prisma.adminAnalytics.update({
          where: { id },
          data: {
            engagementRate,
            views,
            bookmarks,
          },
        });

        res
          .status(200)
          .json({ message: "Analytics updated", updatedAnalytics });
      } catch (error) {
        return new ErrorHandler(
          `Internal Server Error in updatedAnalytics `,
          500
        );
      }
    }
  );

  public deleteAdminAnalytics = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;

        if (!id) {
          return next(
            new ErrorHandler("Id not found in deleteAdminAnalytics", 400)
          );
        }

        await prisma.adminAnalytics.delete({
          where: { id },
        });

        res.status(200).json({ message: "Admin Analytics deleted" });
      } catch (error) {
        next(new Error("Failed to delete analytics"));
      }
    }
  );
}

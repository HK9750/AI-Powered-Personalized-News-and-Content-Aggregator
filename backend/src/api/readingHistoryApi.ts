import { Request, Response, NextFunction } from "express";
import AsyncErrorHandler from "../utils/asyncErrorHandler";
import ErrorHandler from "../utils/errorHandler";
import prisma from "../utils/prisma";

export class ReadingHistoryApi {
  public createOrUpdateReadingHistory = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId, contentId, progress } = req.body;

        if (!userId || !contentId || !progress) {
          return next(
            new ErrorHandler(
              "UserId,ContentId and progress not found in createOrUpdateReadingHistory",
              400
            )
          );
        }

        const readingHistory = await prisma.readingHistory.upsert({
          where: {
            userId_contentId: {
              userId,
              contentId,
            },
          },
          update: {
            lastAccessedAt: new Date(),
            progress,
          },
          create: {
            userId,
            contentId,
            progress,
          },
        });

        res
          .status(201)
          .json({ message: "Reading History created/updated", readingHistory });
      } catch (error) {
        next(new ErrorHandler("Failed to create/update reading history", 500));
      }
    }
  );

  public getReadingHistoryByUser = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = req.params;

        if (!userId) {
          return next(
            new ErrorHandler("userID not found in getReadingHistoryByUser", 400)
          );
        }

        const readingHistory = await prisma.readingHistory.findMany({
          where: { userId },
          select: { Content: true },
        });

        res.status(200).json({ readingHistory });
      } catch (error) {
        next(new ErrorHandler("Failed to fetch reading history", 500));
      }
    }
  );

  public deleteReadingHistory = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = req.params;

        if (!userId) {
          return next(
            new ErrorHandler("userID not found in deleteReadingHistory", 400)
          );
        }

        const readingHistory = await prisma.readingHistory.findMany({
          where: { userId },
          select: { Content: true },
        });

        res.status(200).json({ readingHistory });
      } catch (error) {
        next(new ErrorHandler("Failed to fetch reading history", 500));
      }
    }
  );
}

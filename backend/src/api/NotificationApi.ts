import { Request, Response, NextFunction } from "express";
import AsyncErrorHandler from "../utils/asyncErrorHandler";
import ErrorHandler from "../utils/errorHandler";
import prisma from "../utils/prisma";

export class NotificationApi {
  public getNotificationsByUser = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = req.params;

        if (!userId) {
          return next(
            new ErrorHandler("userID not found in getNotificationsByUser", 400)
          );
        }

        const notifications = await prisma.notification.findMany({
          where: { userId },
        });

        res.status(200).json({ notifications });
      } catch (error) {
        next(new ErrorHandler("Failed to fetch notifications", 500));
      }
    }
  );
}

import { Request, Response, NextFunction } from "express";
import AsyncErrorHandler from "../utils/asyncErrorHandler";
import ErrorHandler from "../utils/errorHandler";
import prisma from "../utils/prisma";

export class DashBoardConfigApi {
  public createOrUpdateDashboardConfig = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId, layout, theme } = req.body;

        if (!userId || !layout || !theme) {
          return next(
            new ErrorHandler(
              "UserId, Layout, Theme are missing in createOrUpdateDashboardConfig",
              400
            )
          );
        }

        const dashboardConfig = await prisma.dashboardConfig.upsert({
          where: { userId },
          update: {
            layout,
            theme,
          },
          create: {
            userId,
            layout,
            theme,
          },
        });

        res.status(201).json({
          message: "Dashboard Config created/updated",
          dashboardConfig,
        });
      } catch (error) {
        next(new ErrorHandler("Failed to create/update dashboard config", 500));
      }
    }
  );

  public getDashboardConfig = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = req.params;

        if (!userId) {
          return next(
            new ErrorHandler("userId not found in getDashboardConfig", 400)
          );
        }

        const dashboardConfig = await prisma.dashboardConfig.findUnique({
          where: { userId },
        });

        res.status(200).json({ dashboardConfig });
      } catch (error) {
        next(new ErrorHandler("Failed to fetch dashboard config", 500));
      }
    }
  );

  public deleteDashboardConfig = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = req.params;

        if (!userId) {
          return next(
            new ErrorHandler("userId not found in deleteDashboardConfig", 400)
          );
        }

        await prisma.dashboardConfig.delete({
          where: { userId },
        });

        res.status(200).json({ message: "Dashboard Config deleted" });
      } catch (error) {
        next(new ErrorHandler("Failed to delete dashboard config", 500));
      }
    }
  );
}

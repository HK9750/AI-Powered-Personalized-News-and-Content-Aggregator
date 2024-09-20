import { Request, Response, NextFunction } from "express";
import AsyncErrorHandler from "../utils/asyncErrorHandler";
import ErrorHandler from "../utils/errorHandler";
import prisma from "../utils/prisma";

export class PreferencesApi {
  public createPreferences = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { preferences } = req.body;

        if (!preferences) {
          return next(new ErrorHandler("Preferences is required", 400));
        }

        const newPreferences = await prisma.preferences.create({
          data: {
            sources: preferences.sources,
            topics: preferences.topics,
            userId: req.user.id,
          },
        });

        return res.status(201).json({
          preferences: newPreferences,
        });
      } catch (error) {
        return next(
          new ErrorHandler("Internal Server Error in createPreferences", 500)
        );
      }
    }
  );

  public getPreferences = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const preferences = await prisma.preferences.findUnique({
          where: { userId: req.user.id },
        });

        return res.status(200).json({
          preferences,
        });
      } catch (error) {
        return next(
          new ErrorHandler("Internal Server Error in getPreferences", 500)
        );
      }
    }
  );

  public updatePreferences = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { preferences } = req.body;

        if (!preferences) {
          return next(new ErrorHandler("Preferences is required", 400));
        }

        const updatedPreferences = await prisma.preferences.update({
          where: { userId: req.user.id },
          data: {
            sources: preferences.sources,
            topics: preferences.topics,
          },
        });

        return res.status(200).json({
          preferences: updatedPreferences,
        });
      } catch (error) {
        return next(
          new ErrorHandler("Internal Server Error in updatePreferences", 500)
        );
      }
    }
  );

  public deletePreferences = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await prisma.preferences.delete({
          where: { userId: req.user.id },
        });

        return res.status(200).json({
          message: "Preferences deleted successfully",
        });
      } catch (error) {
        return next(
          new ErrorHandler("Internal Server Error in deletePreferences", 500)
        );
      }
    }
  );
}

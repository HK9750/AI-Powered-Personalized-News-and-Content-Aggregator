import AsyncErrorHandler from "../utils/asyncErrorHandler";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import prisma from "../utils/prisma";

export class BookmarkApi {
  public getBookmarks = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const bookmarks = await prisma.bookmark.findMany();
        res.status(200).json({ success: true, data: bookmarks });
      } catch (error) {
        return next(
          new ErrorHandler("Internal Server Error in getBookmarks", 500)
        );
      }
    }
  );

  public createBookmark = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId, contentId } = req.body;
        const bookmark = await prisma.bookmark.create({
          data: {
            userId: userId,
            contentId: contentId,
          },
        });
        res.status(201).json({ success: true, data: bookmark });
      } catch (error) {
        return next(
          new ErrorHandler("Internal Server Error in createBookmark", 500)
        );
      }
    }
  );

  public deleteBookmark = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        await prisma.bookmark.delete({ where: { id: id } });
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        return next(
          new ErrorHandler("Internal Server Error in deleteBookmark", 500)
        );
      }
    }
  );

  public updateBookmark = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const { userId, contentId } = req.body;
        const bookmark = await prisma.bookmark.update({
          where: { id: id },
          data: {
            userId: userId,
            contentId: contentId,
          },
        });
        res.status(200).json({ success: true, data: bookmark });
      } catch (error) {
        return next(
          new ErrorHandler("Internal Server Error in updateBookmark", 500)
        );
      }
    }
  );

  public getBookmarkByUser = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = req.params;
        const bookmarks = await prisma.bookmark.findMany({
          where: { userId: userId },
        });
        res.status(200).json({ success: true, data: bookmarks });
      } catch (error) {
        return next(
          new ErrorHandler("Internal Server Error in getBookmarkByUser", 500)
        );
      }
    }
  );
}

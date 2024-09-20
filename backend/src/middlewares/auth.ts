import { Response, Request, NextFunction } from "express";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import AsyncErrorHandler from "../utils/asyncErrorHandler";
import ErrorHandler from "../utils/errorHandler";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateUser = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ErrorHandler("No token provided", 401));
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded: any = jwt.verify(
        token,
        process.env.NEXT_PUBLIC_AUTH0_SECRET!
      );

      if (!decoded || !decoded.email) {
        return next(new ErrorHandler("Invalid token", 401));
      }

      const user = await prisma.user.findUnique({
        where: { email: decoded.email.toLowerCase() },
      });

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      req.user = user;

      next();
    } catch (error) {
      return next(new ErrorHandler("Unauthorized access", 401));
    }
  }
);

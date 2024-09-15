import { getToken } from "next-auth/jwt";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";

interface CustomRequest extends Request {
  user?: any;
}

export const extractUserFromSession = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      raw: true,
    });

    console.log("session", session);

    if (!session || !session) {
      return next(new ErrorHandler("User is not authenticated", 401));
    }

    req.user = session;

    next();
  } catch (error) {
    return next(new ErrorHandler("Error in authentication", 500));
  }
};

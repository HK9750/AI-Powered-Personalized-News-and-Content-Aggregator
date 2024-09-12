import { Response, Request, NextFunction } from "express";
import AsyncErrorHandler from "../utils/asyncErrorHandler";
import ErrorHandler from "../utils/errorHandler";
import prisma from "../utils/prisma";

interface IUserAuth {
  name: string;
  email: string;
}

export class UserApi {
  public userAuth = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email } = req.body as IUserAuth;
      if (!name || !email) {
        return next(new ErrorHandler("Please enter all fields", 400));
      }
      try {
        const lowerCaseEmail = email.toLowerCase();
        const user = await prisma.user.upsert({
          where: { email: lowerCaseEmail },
          update: { email: lowerCaseEmail, name },
          create: { email: lowerCaseEmail, name },
        });
        return res.status(200).json({
          success: true,
          message: "User Authenticated",
          user,
        });
      } catch (error) {
        return next(new ErrorHandler("Internal Server error in userAuth", 500));
      }
    }
  );
  public getUser = AsyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;

      if (!email) {
        return next(new ErrorHandler("Please enter email", 400));
      }

      try {
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user) {
          return res.status(200).json({
            success: false,
            message: "User not found",
            user: null,
          });
        }

        return res.status(200).json({
          success: true,
          message: "User found",
          user,
        });
      } catch (error) {
        return next(new ErrorHandler("Internal Server error in getUser", 500));
      }
    }
  );
}

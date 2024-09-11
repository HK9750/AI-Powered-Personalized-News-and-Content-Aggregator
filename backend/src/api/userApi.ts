import AsyncErrorHandler from "../utils/asyncErrorHandler";
import ErrorHandler from "../utils/errorHandler";
import prisma from "../utils/prisma";

interface IRegisterUser {
  name: string;
  email: string;
}

export class UserApi {
  public userAuth = AsyncErrorHandler(async (req: any, res: any, next: any) => {
    const { name, email }: IRegisterUser = req.body;
    if (!name || !email) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }
    try {
      const user = await prisma.user.upsert({
        where: { email },
        update: { email, name },
        create: { email, name },
      });
      return res.status(200).json({
        success: true,
        message: "User Authenticated",
        user,
      });
    } catch (error) {
      return next(new ErrorHandler("Internal Server error in userAuth", 500));
    }
  });
}

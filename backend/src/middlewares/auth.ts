import { getToken } from "next-auth/jwt";
import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the user property
interface CustomRequest extends Request {
  user?: any;
}

export const extractUserFromSession = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Attach user info to the request
  req.user = token;

  next();
};

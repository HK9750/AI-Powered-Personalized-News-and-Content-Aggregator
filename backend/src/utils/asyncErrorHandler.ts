import { NextFunction } from "express";

export const AsyncErrorHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default AsyncErrorHandler;

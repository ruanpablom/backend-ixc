import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";

export const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user.role === "ADMIN") {
    // If the user is authenticated, call the next middleware function
    return next();
  } else {
    // If the user is not authenticated, return a 403 Forbidden error
    return res.status(403).send(new AppError('Forbidden', 403));
  }
}
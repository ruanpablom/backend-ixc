import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";

export const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user.role === "ADMIN") {
    return next();
  } else {
    return res.status(403).send(new AppError('Forbidden', 403));
  }
}
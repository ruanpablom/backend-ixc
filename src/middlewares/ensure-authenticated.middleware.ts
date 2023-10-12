import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(403).send(new AppError('Forbidden', 403));
  }
}
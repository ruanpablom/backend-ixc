import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { AppError } from "../errors";

export const passportAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: any, user: Express.User) => {
    if (err) { 
      return next(err); 
    }
    if (!user) { 
      return res.status(401).send(new AppError('Invalid credentials', 401));
    }
    req.logIn(user, function(err) {
      if (err) { 
        return next(err);
      }
      return next();
    });
  })(req, res, next);
}
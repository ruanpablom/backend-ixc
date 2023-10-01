import { Router } from "express";
import { register, login } from "../../auth/auth.controller";
import { passportAuthenticate } from "../../middlewares/passport-authenticate.middleware";
import { ensureAuthenticated } from "../../middlewares/ensure-authenticated.middleware";

export default (router: Router): void => {
  router.post("/signup", ensureAuthenticated, register);
  router.post("/login", passportAuthenticate, login)
}
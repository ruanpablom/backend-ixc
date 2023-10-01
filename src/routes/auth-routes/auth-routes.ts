import { Router } from "express";
import { register, login, logout, me } from "../../auth/auth.controller";
import { passportAuthenticate } from "../../middlewares/passport-authenticate.middleware";
import { ensureAdmin } from "../../middlewares/ensure-admin.middleware";
import { ensureAuthenticated } from "../../middlewares/ensure-authenticated.middleware";

export default (router: Router): void => {
  router.post("/signup", ensureAdmin, register);
  router.post("/login", passportAuthenticate, login)
  router.get("/logout", logout)
  router.get("/me", ensureAuthenticated, me)
}
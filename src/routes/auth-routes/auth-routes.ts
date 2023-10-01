import { Router } from "express";
import { register, login } from "../../auth/auth.controller";
import { passportAuthenticate } from "../../middlewares/passport-authenticate.middleware";

export default (router: Router): void => {
  router.post("/signup", register);
  router.post("/login", passportAuthenticate, login)
}
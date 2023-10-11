import session from "express-session";

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || '',
  name:'sid',
  resave: false ,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000},
})
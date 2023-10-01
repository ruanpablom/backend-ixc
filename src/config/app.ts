import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import passport from 'passport'
import session from 'express-session'
import { Strategy as LocalStrategy } from 'passport-local'

import setupRoutes from './routes';
import responseError from '../middlewares/response-error.middleware';
import { authUser } from '../infra/passport';
import { prisma } from '../infra/prisma';

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET || '',
  resave: false ,
  saveUninitialized: true ,
}));

app.use(passport.initialize()); 
app.use(passport.session());    

passport.use(new LocalStrategy (authUser));

passport.serializeUser((user, done) => {  
  console.log(`Value of "User" in serializeUser function ----> ${user}`)
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id: String(id) } })
  if(!user) return done(new Error('User not found'))

  done (null, {role: user.role, id: user.id} )      
}) 

app.use(express.json());
app.use(cors());

setupRoutes(app);

app.use(responseError)

export default app;
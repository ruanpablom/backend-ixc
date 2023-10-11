import express  from 'express';
import 'express-async-errors';
import cors from 'cors';
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { createServer } from 'node:http'

import setupRoutes from './routes';
import responseError from '../middlewares/response-error.middleware';
import { authUser } from '../infra/passport';
import { prisma } from '../infra/prisma';
import { corsConfig } from './cors-config';
import { setupIo } from './io';
import { sessionMiddleware } from '../middlewares/session.middleware';


const app = express();

export const server = createServer(app);

app.use(express.json());
app.use(cors(corsConfig));

app.use(sessionMiddleware);

app.use(passport.initialize()); 
app.use(passport.session()); 

passport.use(new LocalStrategy (authUser));

passport.serializeUser((user, done) => {  
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id: String(id) } })
  if(!user) return done(new Error('User not found'))

  done (null, {role: user.role, id: user.id} )      
}) 

setupRoutes(app);

setupIo(server);

app.use(responseError)

export default app;
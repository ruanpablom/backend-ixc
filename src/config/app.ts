import express, {  Request, RequestHandler } from 'express';
import 'express-async-errors';
import cors from 'cors';
import passport from 'passport'
import session from 'express-session'
import { Strategy as LocalStrategy } from 'passport-local'
import { Server, Socket } from 'socket.io'

import setupRoutes from './routes';
import responseError from '../middlewares/response-error.middleware';
import { authUser } from '../infra/passport';
import { prisma } from '../infra/prisma';
import { corsConfig } from './cors-config';
import { ExtendedError } from 'socket.io/dist/namespace';
import { initializeUser, onMessage } from '../socketio/socketio.controller';

type SocketOrRequest = Socket | { request: { session: any } };

const app = express();
export const server = require("http").createServer(app);
const io = new Server(server, {
  cors: corsConfig,
});

app.use(express.json());
app.use(cors(corsConfig));

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || '',
  name:'sid',
  resave: false ,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000},
})

app.use(sessionMiddleware);

app.use(passport.initialize()); 
app.use(passport.session()); 

const wrap = (middleware: RequestHandler) => (socket: SocketOrRequest, next: (err?: ExtendedError) => void) =>
// @ts-ignore  
  middleware(socket.request, {} as any, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  // @ts-ignore
  if (socket.request.user) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
});

io.on("connect", (socket) => {
  initializeUser(socket);

  socket.on("message", (message) => onMessage(socket, message));
  // @ts-ignore
  const session = socket.request.session;

  session.socketId = socket.id;
  session.save();
});

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

app.use(responseError)

export default app;
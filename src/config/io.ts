import http from "http"; 
import { Server, Socket } from "socket.io";
import { corsConfig } from "./cors-config";
import { RequestHandler } from "express";
import passport from "passport";
import { onConnect, onSocektsConnection } from "../socketio/socketio.controller";
import { ExtendedError } from "socket.io/dist/namespace";
import { authorizationIo } from "../socketio/middlewares/authorization.middleware";
import { sessionMiddleware } from "../middlewares/session.middleware";

type SocketOrRequest = Socket | { request: { session: any } };


const wrap = (middleware: RequestHandler) => (socket: SocketOrRequest, next: (err?: ExtendedError) => void) =>
// @ts-ignore  
  middleware(socket.request, {} as any, next);


export const setupIo = (httpServer: http.Server) => { // change the type of httpServer parameter to http.Server
  const io = new Server(httpServer, {
    cors: corsConfig,
  });

  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  io.use(authorizationIo);

  io.on("connect", onConnect);

  io.sockets.on('connection', onSocektsConnection);
}


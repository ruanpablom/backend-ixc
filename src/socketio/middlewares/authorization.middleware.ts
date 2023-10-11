import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";

export const authorizationIo = (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
  // @ts-ignore
  if (socket.request.user) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
}
import { Message } from "@prisma/client";
import { Socket } from "socket.io";
import { prisma } from "../infra/prisma";

export const initializeUser = async (socket: Socket) => {
  // @ts-ignore
  socket.join("chat");

  // @ts-ignore
  socket.emit("connected", true, socket.request.user.id);

  // if (messages && messages.length > 0) {
  //   socket.emit("messages", messages);
  // }
};

export const onMessage = async (socket: Socket, message: Message) => {
  try{
    const dbMessage = await prisma.message.create({ data: message, include: { user: true } });
    const { user, ...restMessage } = dbMessage;
    const {password, ...restUser} = user;
    // @ts-ignore
    socket.broadcast.emit("message", {...restMessage, user: restUser});
    socket.emit("message", {...restMessage, user: restUser});
  }catch (err) {
    console.log(err);
  }
}
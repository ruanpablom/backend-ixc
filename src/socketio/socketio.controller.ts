import { Message } from "@prisma/client";
import { Socket } from "socket.io";
import { prisma } from "../infra/prisma";
import { redis } from "../infra/redis";

export const initializeUser = async (socket: Socket) => {
  try {
    // @ts-ignore
    await redis.sAdd("connectedUsers", String(socket.request.user.id));
    const connectedUsers = await redis.sMembers("connectedUsers");
    // @ts-ignore
    socket.join("chat");
    // @ts-ignore
    socket.broadcast.emit("newUserConnected", true, socket.request.user.id);
    // @ts-ignore
    socket.emit("connected", true, socket.request.user.id);

    let users = await prisma.user.findMany({select: {id: true, name: true, email: true, role: true}});
    // @ts-ignore
    users = users.map((user) => connectedUsers.includes(user.id) ? {...user, connected: true} : {...user, connected: false});
    
    socket.emit("users", users);

    const dbMessages = await prisma.message.findMany({ include: { user: { select: {id: true, name: true, email: true, role: true} } } });

    if(dbMessages.length > 0){
      socket.emit("messages", dbMessages);
    }
  }catch (err) {
    console.log(err);
  }
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

export const onConnect = async (socket: Socket) => {
  // @ts-ignore
  console.log('Got connection!', socket.request.user.id);
  
  initializeUser(socket);

  socket.on("message", (message) => onMessage(socket, message));
  // @ts-ignore
  const session = socket.request.session;

  session.socketId = socket.id;
  session.save();
}

export const onSocektsConnection = (socket: Socket) => {
  socket.on('disconnect', async () => {
    // @ts-ignore
    console.log('Got disconnect!', socket.request.user.id);
    try {
      // @ts-ignore
      await redis.sRem("connectedUsers", String(socket.request.user.id));
    }catch(err) {
      console.log(err);
    }
     // @ts-ignore
     socket.broadcast.emit("disconnectedUser", socket.request.user.id);
  });
}
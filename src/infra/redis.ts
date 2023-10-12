import { createClient } from 'redis';
import { Server as IoServer } from 'socket.io';
import { server } from '../config/app';


export const redis = createClient({
  url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:6379`,
  disableOfflineQueue: true
});

export const setupRedis = async (ioServer: IoServer) => { 
  try{
    redis.on('error', (err) => {
      console.log('Redis Cluster Error', err);
      ioServer.disconnectSockets();
    });

    redis.on('ready', () => {
      console.log('Redis client ready');
      redis.flushDb();
      ioServer.disconnectSockets();
    });

    await redis.connect();
  }catch(err){
    console.log(err);
  }
};

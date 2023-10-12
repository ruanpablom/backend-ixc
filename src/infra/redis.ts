import { createClient } from 'redis';

export const redis = createClient({
  url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:6379`
});

export const setupRedis = async () => { 
  redis.on('error', (err) => console.log('Redis Cluster Error', err));

  redis.on('connect', () => {
    console.log('Redis connected');
    redis.flushDb();
  });
  
  await redis.connect();
};
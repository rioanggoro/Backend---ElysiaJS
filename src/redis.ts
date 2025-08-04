import Redis from 'ioredis';

const redis = new Redis(
  'rediss://default:ASJBAAIjcDFhMDU5NDIyZWMwZDc0OTBlOGEyMzVkNjI5YWJjODJhMHAxMA@awake-flea-8769.upstash.io:6379'
);
await redis.set('foo', 'bar');

export default redis;

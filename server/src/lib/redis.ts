import { createClient } from "redis";
import { REDIS_URL } from "./constants";

export const redisClient = createClient({
  url: REDIS_URL,
});

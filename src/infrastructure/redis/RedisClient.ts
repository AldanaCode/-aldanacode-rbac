import Redis from "ioredis";

import {
  getRedisConfig,
  type RedisConfig,
} from "./RedisConfig.js";

export function createRedisClient(
  config?: RedisConfig
): Redis {
  const resolvedConfig =
    config ?? getRedisConfig();

  return new Redis(resolvedConfig.url);
}
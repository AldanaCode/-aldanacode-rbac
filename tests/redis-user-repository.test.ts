import { afterAll, describe, expect, it } from "vitest";
import Redis from "ioredis";

import { User } from "../src/domain/entities/User.js";
import { RedisUserRepository } from "../src/infrastructure/redis/RedisUserRepository.js";

const redis = new Redis(
  "redis://localhost:6379/2"
);

const repository =
  new RedisUserRepository(redis);

describe("RedisUserRepository", () => {
  afterAll(async () => {
    await redis.quit();
  });

  it("saves and retrieves a user", async () => {
    const user = new User("user-1");

    user.assignRole("admin");
    user.assignRole("editor");

    await repository.save(user);

    const result =
      await repository.findById("user-1");

    expect(result).not.toBeNull();

    expect(result?.id).toBe("user-1");

    expect(result?.hasRole("admin")).toBe(true);
    expect(result?.hasRole("editor")).toBe(true);
  });

  it("returns null for an unknown user", async () => {
    const result =
      await repository.findById(
        "unknown-user"
      );

    expect(result).toBeNull();
  });
});
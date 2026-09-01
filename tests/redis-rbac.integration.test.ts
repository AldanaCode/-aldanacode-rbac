import { afterAll, beforeEach, describe, expect, it } from "vitest";
import Redis from "ioredis";
import { createRedisClient } from "../src/redis.js";

import { RBAC } from "../src/index.js";
import { RedisRoleRepository } from "../src/infrastructure/redis/RedisRoleRepository.js";
import { RedisUserRepository } from "../src/infrastructure/redis/RedisUserRepository.js";

type AppPermissions = {
  "users.read": unknown;
  "users.create": unknown;
  "users.update": unknown;
  "users.delete": unknown;
};

const redis = createRedisClient({
  url: "redis://localhost:6379/3",
});


const rbac = new RBAC<AppPermissions>({
  roleRepository: new RedisRoleRepository(redis),
  userRepository: new RedisUserRepository(redis),
});

describe("RBAC with Redis", () => {
  beforeEach(async () => {
    await redis.flushdb();
  });

  afterAll(async () => {
    await redis.quit();
  });

  it("authorizes a user using persisted Redis data", async () => {
    await rbac.addRole("admin", [
      "users.read",
      "users.create",
    ]);

    await rbac.createUser("user-1");

    await rbac.assignRole(
      "user-1",
      "admin"
    );

    expect(
      await rbac.can(
        "user-1",
        "users.create"
      )
    ).toBe(true);
  });

  it("denies a user without the required permission", async () => {
    await rbac.addRole("employee", [
      "users.read",
    ]);

    await rbac.createUser("user-2");

    await rbac.assignRole(
      "user-2",
      "employee"
    );

    expect(
      await rbac.can(
        "user-2",
        "users.delete"
      )
    ).toBe(false);
  });

  it("denies unknown users", async () => {
    expect(
      await rbac.can(
        "unknown-user",
        "users.read"
      )
    ).toBe(false);
  });
});
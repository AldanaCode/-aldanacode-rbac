import { afterAll, describe, expect, it } from "vitest";
import Redis from "ioredis";

import { Permission } from "../src/domain/entities/Permission.js";
import { Role } from "../src/domain/entities/Role.js";
import { RedisRoleRepository } from "../src/infrastructure/redis/RedisRoleRepository.js";

const redis = new Redis(
  "redis://localhost:6379/1"
);

const repository =
  new RedisRoleRepository(redis);

describe("RedisRoleRepository", () => {
  afterAll(async () => {
    await redis.quit();
  });

  it("saves and retrieves a role", async () => {
    const role = new Role("admin", [
      new Permission("users.read"),
      new Permission("users.create"),
    ]);

    await repository.save(role);

    const result =
      await repository.findByName("admin");

    expect(result).not.toBeNull();

    expect(result?.name).toBe("admin");

    expect(
      result?.hasPermission("users.read")
    ).toBe(true);

    expect(
      result?.hasPermission("users.create")
    ).toBe(true);
  });

  it("returns null for an unknown role", async () => {
    const result =
      await repository.findByName(
        "unknown-role"
      );

    expect(result).toBeNull();
  });

  it("deletes a role", async () => {
    const role = new Role("temporary", [
      new Permission("users.read"),
    ]);

    await repository.save(role);

    await repository.delete("temporary");

    const result =
      await repository.findByName("temporary");

    expect(result).toBeNull();
  });
});
import type Redis from "ioredis";

import type { RoleRepository } from "../../ports/RoleRepository.js";
import type { Role } from "../../domain/entities/Role.js";

import { RoleRedisMapper } from "./mappers/RoleRedisMapper.js";

export class RedisRoleRepository
  implements RoleRepository
{
  private readonly keyPrefix = "rbac:role:";

  constructor(
    private readonly redis: Redis
  ) {}

  async findByName(
    name: string
  ): Promise<Role | null> {
    const key = this.getKey(name);

    const data = await this.redis.get(key);

    if (!data) {
      return null;
    }

    return RoleRedisMapper.toDomain(data);
  }

  async save(
    role: Role
  ): Promise<void> {
    const key = this.getKey(role.name);

    const data =
      RoleRedisMapper.toPersistence(role);

    await this.redis.set(key, data);
  }

  async delete(
    name: string
  ): Promise<void> {
    const key = this.getKey(name);

    await this.redis.del(key);
  }

  private getKey(
    name: string
  ): string {
    return `${this.keyPrefix}${name}`;
  }
}
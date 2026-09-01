import type Redis from "ioredis";

import type { UserRepository } from "../../ports/UserRepository.js";
import type { User } from "../../domain/entities/User.js";

import { UserRedisMapper } from "./mappers/UserRedisMapper.js";

export class RedisUserRepository
  implements UserRepository
{
  private readonly keyPrefix = "rbac:user:";

  constructor(
    private readonly redis: Redis
  ) {}

  async findById(
    id: string
  ): Promise<User | null> {
    const key = this.getKey(id);

    const data = await this.redis.get(key);

    if (!data) {
      return null;
    }

    return UserRedisMapper.toDomain(data);
  }

  async save(
    user: User
  ): Promise<void> {
    const key = this.getKey(user.id);

    const data =
      UserRedisMapper.toPersistence(user);

    await this.redis.set(key, data);
  }

  private getKey(
    id: string
  ): string {
    return `${this.keyPrefix}${id}`;
  }
}
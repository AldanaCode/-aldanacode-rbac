import { User } from "../../../domain/entities/User.js";

interface UserPersistence {
  id: string;
  roles: string[];
}

export class UserRedisMapper {
  static toPersistence(
    user: User
  ): string {
    const data: UserPersistence = {
      id: user.id,
      roles: user.getRoles(),
    };

    return JSON.stringify(data);
  }

  static toDomain(
    data: string
  ): User {
    const parsed =
      JSON.parse(data) as UserPersistence;

    const user = new User(parsed.id);

    for (const role of parsed.roles) {
      user.assignRole(role);
    }

    return user;
  }
}
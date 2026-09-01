import { Permission } from "../../../domain/entities/Permission.js";
import { Role } from "../../../domain/entities/Role.js";

interface RolePersistence {
  name: string;
  permissions: string[];
}

export class RoleRedisMapper {
  static toPersistence(
    role: Role
  ): string {
    const data: RolePersistence = {
      name: role.name,
      permissions: role
        .getPermissions()
        .map((permission) => permission.name),
    };

    return JSON.stringify(data);
  }

  static toDomain(
    data: string
  ): Role {
    const parsed =
      JSON.parse(data) as RolePersistence;

    const permissions = parsed.permissions.map(
      (permission) =>
        new Permission(permission)
    );

    return new Role(
      parsed.name,
      permissions
    );
  }
}
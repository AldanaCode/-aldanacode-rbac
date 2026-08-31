import { Permission } from "./domain/entities/Permission.js";
import { Role } from "./domain/entities/Role.js";
import { User } from "./domain/entities/User.js";
import { AuthorizationService } from "./application/AuthorizationService.js";
import { InMemoryRoleRepository } from "./infrastructure/memory/InMemoryRoleRepository.js";
import { InMemoryUserRepository } from "./infrastructure/memory/InMemoryUserRepository.js";
import { PermissionMap,PermissionName } from "./domain/types/permissions.js";

export class RBAC<TPermissions extends PermissionMap> {
  private readonly roleRepository =
    new InMemoryRoleRepository();

  private readonly userRepository =
    new InMemoryUserRepository();

  private readonly authorization: AuthorizationService;

  constructor() {
    this.authorization = new AuthorizationService(
      this.userRepository,
      this.roleRepository
    );
  }

  async addRole(
    name: string,
    permissions: PermissionName<TPermissions>[] = []
  ): Promise<void> {
    const role = new Role(
      name,
     permissions.map(
    (permission) =>
      new Permission<PermissionName<TPermissions>>(
        permission
      )
  )
    );

    await this.roleRepository.save(role);
  }

  async createUser(id: string): Promise<void> {
    const user = new User(id);

    await this.userRepository.save(user);
  }

  async assignRole(
    userId: string,
    roleName: string
  ): Promise<void> {
    const user =
      await this.userRepository.findById(userId);

    if (!user) {
      throw new Error(`User "${userId}" not found`);
    }

    const role =
      await this.roleRepository.findByName(roleName);

    if (!role) {
      throw new Error(`Role "${roleName}" not found`);
    }

    user.assignRole(roleName);

    await this.userRepository.save(user);
  }

  async can(
    userId: string,
    permission: PermissionName<TPermissions>
  ): Promise<boolean> {
    return this.authorization.can(
      userId,
      permission
    );
  }
}

export {
  Permission,
  Role,
  User,
  AuthorizationService,
};
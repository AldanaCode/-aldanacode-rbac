import { Permission } from "./Permission.js";

export class Role {
  private readonly permissions: Map<string, Permission>;

  constructor(
    public readonly name: string,
    permissions: Permission[] = []
  ) {
    if (!name.trim()) {
      throw new Error("Role name cannot be empty");
    }

    this.permissions = new Map(
      permissions.map((permission) => [
        permission.name,
        permission,
      ])
    );
  }

  addPermission(permission: Permission): void {
    this.permissions.set(permission.name, permission);
  }

  removePermission(permissionName: string): void {
    this.permissions.delete(permissionName);
  }

  hasPermission(permissionName: string): boolean {
    return this.permissions.has(permissionName);
  }

  getPermissions(): Permission[] {
    return [...this.permissions.values()];
  }
}
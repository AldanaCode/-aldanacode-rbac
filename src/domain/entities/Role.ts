import { Permission } from "./Permission.js";

export class Role<TPermission extends string = string> {
  private readonly permissions: Map<
    TPermission,
    Permission<TPermission>
  >;

  constructor(
    public readonly name: string,
    permissions: Permission<TPermission>[] = []
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

  addPermission(
    permission: Permission<TPermission>
  ): void {
    this.permissions.set(
      permission.name,
      permission
    );
  }

  removePermission(
    permissionName: TPermission
  ): void {
    this.permissions.delete(permissionName);
  }

  hasPermission(
    permissionName: TPermission
  ): boolean {
    return this.permissions.has(permissionName);
  }

  getPermissions(): Permission<TPermission>[] {
    return [...this.permissions.values()];
  }
}
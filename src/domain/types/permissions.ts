export type PermissionMap = Record<string, unknown>;

export type PermissionName<T extends PermissionMap> =
  keyof T & string;
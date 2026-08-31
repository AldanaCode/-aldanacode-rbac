import { describe, expectTypeOf, it } from "vitest";
import type { PermissionName } from "../src/domain/types/permissions.js";

type AppPermissions = {
  "users.read": unknown;
  "users.create": unknown;
  "users.update": unknown;
  "users.delete": unknown;
};

describe("Permission types", () => {
  it("exposes only the application's permissions", () => {
    type Permissions = PermissionName<AppPermissions>;

    expectTypeOf<Permissions>().toEqualTypeOf<
      | "users.read"
      | "users.create"
      | "users.update"
      | "users.delete"
    >();
  });
});
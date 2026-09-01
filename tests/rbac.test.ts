import { describe, expect, it } from "vitest";
import { RBAC } from "../src/index.js";

type AppPermissions = {
  "users.read": unknown;
  "users.create": unknown;
  "users.update": unknown;
  "users.delete": unknown;
};

describe("RBAC", () => {
  it("allows a user with the required permission", async () => {
    const rbac = new RBAC<AppPermissions>();

    await rbac.addRole("admin", [
      "users.read",
      "users.create",
      "users.update",
      "users.delete",
    ]);

    await rbac.createUser("user-1");

    await rbac.assignRole(
      "user-1",
      "admin"
    );

    expect(
      await rbac.can(
        "user-1",
        "users.create"
      )
    ).toBe(true);
  });

  it("denies a user without the required permission", async () => {
    const rbac = new RBAC<AppPermissions>();

    await rbac.addRole("employee", [
      "users.read",
    ]);

    await rbac.createUser("user-1");

    await rbac.assignRole(
      "user-1",
      "employee"
    );

    expect(
      await rbac.can(
        "user-1",
        "users.delete"
      )
    ).toBe(false);
  });

  it("denies unknown users", async () => {
    const rbac = new RBAC<AppPermissions>();

    expect(
      await rbac.can(
        "unknown-user",
        "users.read"
      )
    ).toBe(false);
  });
});
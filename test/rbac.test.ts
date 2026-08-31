import { describe, expect, it } from "vitest";
import { RBAC } from "../src/index.js";

describe("RBAC", () => {
  it("allows a user with the required permission", async () => {
    const rbac = new RBAC();

    await rbac.addRole("admin", [
      "users.read",
      "users.create",
    ]);

    await rbac.createUser("user-1");

    await rbac.assignRole(
      "user-1",
      "admin"
    );

    const allowed = await rbac.can(
      "user-1",
      "users.create"
    );

    expect(allowed).toBe(true);
  });

  it("denies a user without the required permission", async () => {
    const rbac = new RBAC();

    await rbac.addRole("employee", [
      "users.read",
    ]);

    await rbac.createUser("user-1");

    await rbac.assignRole(
      "user-1",
      "employee"
    );

    const allowed = await rbac.can(
      "user-1",
      "users.delete"
    );

    expect(allowed).toBe(false);
  });

  it("denies unknown users", async () => {
    const rbac = new RBAC();

    const allowed = await rbac.can(
      "unknown-user",
      "users.read"
    );

    expect(allowed).toBe(false);
  });
});
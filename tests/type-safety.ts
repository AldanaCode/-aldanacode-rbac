import { RBAC } from "../src/index.js";

type AppPermissions = {
  "users.read": unknown;
  "users.create": unknown;
  "users.update": unknown;
  "users.delete": unknown;
};

const rbac = new RBAC<AppPermissions>();

rbac.addRole("admin", [
  "users.read",
  "users.create",
]);

rbac.can(
  "user-1",
  // @ts-expect-error Invalid permission
  "users.cretae"
);

rbac.addRole("bad-role", [
  // @ts-expect-error Invalid permission
  "users.cretae",
]);
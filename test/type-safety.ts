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
  "users.update"
);

// @ts-expect-error Invalid permission
rbac.can(
  "user-1",
  "users.cretae"
);

// @ts-expect-error Invalid permission
rbac.addRole("bad-role", [
  "users.cretae",
]);
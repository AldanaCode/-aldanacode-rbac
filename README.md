# @aldanacode/rbac

Type-safe Role-Based Access Control (RBAC) library for TypeScript applications.

`@aldanacode/rbac` provides a lightweight authorization core based on roles and permissions, with support for in-memory persistence and Redis adapters.

## Features

- 🔐 Role-Based Access Control
- 🧩 Type-safe permissions with TypeScript
- 💾 In-memory repositories
- ⚡ Redis persistence adapter
- 🔌 Repository-based architecture
- 🏗️ Dependency injection
- 🧪 Unit and integration tests
- 📦 ESM package
- 🐳 Docker Compose setup for local Redis development

## Installation

```bash
pnpm add @aldanacode/rbac
```

Or with npm:

```bash
npm install @aldanacode/rbac
```

## Basic Usage

Define the permissions supported by your application:

```typescript
type Permissions = {
  "users:create": unknown;
  "users:read": unknown;
  "users:update": unknown;
  "users:delete": unknown;
  "reports:read": unknown;
};
```

Create an RBAC instance:

```typescript
import { RBAC } from "@aldanacode/rbac";

const rbac = new RBAC<Permissions>();
```

Create a role:

```typescript
await rbac.addRole("admin", [
  "users:create",
  "users:read",
  "users:update",
  "users:delete",
  "reports:read",
]);
```

Create a user:

```typescript
await rbac.createUser("user-1");
```

Assign the role:

```typescript
await rbac.assignRole("user-1", "admin");
```

Check authorization:

```typescript
const allowed = await rbac.can(
  "user-1",
  "users:create"
);

console.log(allowed); // true
```

## Type-Safe Permissions

Permissions are validated at compile time.

For example, given:

```typescript
type Permissions = {
  "users:create": unknown;
  "users:read": unknown;
};
```

This is valid:

```typescript
await rbac.can("user-1", "users:create");
```

While this will be rejected by TypeScript:

```typescript
await rbac.can("user-1", "users:cretae");
```

This helps prevent authorization bugs caused by misspelled permission names.

## Redis Adapter

Redis support is available through the dedicated `/redis` entry point.

Install the required packages:

```bash
pnpm add @aldanacode/rbac ioredis
```

Create a Redis client and repositories:

```typescript
import {
  createRedisClient,
  RedisRoleRepository,
  RedisUserRepository,
} from "@aldanacode/rbac/redis";

const redis = createRedisClient({
  url: "redis://localhost:6379",
});

const roleRepository = new RedisRoleRepository(redis);
const userRepository = new RedisUserRepository(redis);
```

Inject the repositories into RBAC:

```typescript
import { RBAC } from "@aldanacode/rbac";

const rbac = new RBAC<Permissions>({
  roleRepository,
  userRepository,
});
```

The authorization layer remains independent of Redis.

The persistence mechanism can therefore be changed without modifying the domain authorization logic.

## Repository Architecture

The library separates authorization logic from persistence through repository contracts.

```text
                    ┌─────────────────────┐
                    │        RBAC         │
                    │   Application API   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ AuthorizationService│
                    └──────────┬──────────┘
                               │
                     ┌─────────┴─────────┐
                     │                   │
                     ▼                   ▼
              UserRepository      RoleRepository
                     │                   │
             ┌───────┴───────┐   ┌─────┴──────┐
             │               │   │            │
             ▼               ▼   ▼            ▼
          InMemory          Redis            ...
```

This allows infrastructure adapters to implement the same repository contracts without coupling the domain to a specific persistence technology.

## Redis Development

A local Redis instance can be started using Docker Compose:

```bash
docker compose up -d
```

Check the Redis connection:

```bash
docker exec aldanacode-rbac-redis redis-cli ping
```

Expected response:

```text
PONG
```

Stop the development environment:

```bash
docker compose down
```

## Testing

Run the test suite:

```bash
pnpm test
```

Run TypeScript type checking:

```bash
pnpm typecheck
```

Build the package:

```bash
pnpm build
```

The project includes:

- Core RBAC tests
- Type-safety tests
- Redis repository tests
- Redis integration tests

## Package Exports

The core API is available from:

```typescript
import {
  RBAC,
  Role,
  Permission,
  User,
  AuthorizationService,
} from "@aldanacode/rbac";
```

Redis infrastructure is available separately:

```typescript
import {
  createRedisClient,
  RedisRoleRepository,
  RedisUserRepository,
} from "@aldanacode/rbac/redis";
```

Keeping Redis in a dedicated entry point prevents infrastructure concerns from being coupled to the core API.

## Design Principles

The project follows several core principles:

- Separation of concerns
- Dependency inversion
- Explicit infrastructure boundaries
- Type safety
- Small public API
- Testability
- Pragmatic Clean Architecture

The goal is to provide a lightweight authorization core that can evolve without coupling applications to a specific persistence technology.

## Roadmap

### v0.1.0

- Core RBAC
- Roles
- Permissions
- Users
- In-memory repositories

### v0.2.0

- Type-safe permissions

### v0.3.0

- Redis adapter
- Redis repositories
- Redis integration tests
- Docker development environment

### v0.4.0

- Policy engine
- Attribute-Based Access Control (ABAC)

### v0.5.0

- Multi-tenancy

### v1.0.0

- Stable public API
- Production-ready release

## License

MIT © AldanaCode

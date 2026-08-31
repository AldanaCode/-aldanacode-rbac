import type { RoleRepository } from "../../ports/RoleRepository.js";
import type { Role } from "../../domain/entities/Role.js";

export class InMemoryRoleRepository implements RoleRepository {
    private readonly roles = new Map<string, Role>();

    async findByName(name: string): Promise<Role | null> {
        return this.roles.get(name) ?? null;
    }

    async save(role: Role): Promise<void> {
        this.roles.set(role.name, role);
    }

    async delete(name: string): Promise<void> {
        this.roles.delete(name);
    }
}
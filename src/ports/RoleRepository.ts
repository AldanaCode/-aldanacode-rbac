import type { Role } from "../domain/entities/Role.js";

export interface RoleRepository {
    findByName(name: string): Promise<Role | null>;

    save(role: Role): Promise<void>
    delete(name: string): Promise<void>
}
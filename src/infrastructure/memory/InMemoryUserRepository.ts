import type { UserRepository } from "../../ports/UserRepository.js";
import type { User } from "../../domain/entities/User.js";

export class InMemoryUserRepository implements UserRepository {
    private readonly users = new Map<string, User>();

    async findById(id: string): Promise<User | null> {
        return this.users.get(id) ?? null;
    }

    async save(user: User): Promise<void> {
        this.users.set(user.id, user)
    }
}
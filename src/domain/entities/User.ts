export class User {
    private readonly roles = new Set<string>();

    constructor(
        public readonly id: string
    ){
        if (!id.trim()) {
            throw new Error("User id cannot be empty")
        }
    }

    assignRole(roleName: string): void {
        this.roles.add(roleName)
    }

    removeRole(roleName: string): void {
        this.roles.delete(roleName);
    }

    hasRole(roleName: string): boolean {
        return this.roles.has(roleName)
    }

    getRoles(): string[]{
        return [...this.roles]
    }
}
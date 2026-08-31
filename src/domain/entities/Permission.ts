export class Permission{
    constructor(
        public readonly name: string
    ){
        if (!name.trim()) {
            throw new Error("Permission name cannot be empty")
        }
    }

    equals(other: Permission): boolean {
        return this.name === other.name
    }
}
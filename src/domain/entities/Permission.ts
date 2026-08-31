export class Permission<TName extends string = string> {
  constructor(
    public readonly name: TName
  ) {
    if (!name.trim()) {
      throw new Error("Permission name cannot be empty");
    }
  }

  equals(other: Permission<TName>): boolean {
    return this.name === other.name;
  }
}
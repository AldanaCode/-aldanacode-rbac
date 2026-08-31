import type { RoleRepository } from "../ports/RoleRepository.js";
import type { UserRepository } from "../ports/UserRepository.js";

export class AuthorizationService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository
    ){}

    async can(
        userId: string,
        permission: string
    ): Promise <boolean>{
        const user = await this.userRepository.findById(userId);

        if (!user) {
            return false;
        }

        const roles = user.getRoles();

        for(const roleName of roles){
            const role = await this.roleRepository.findByName(roleName);

            if (!role) {
                continue;
            }

            if (role.hasPermission(permission)) {
                return true;
            }
        }

        return false
    }
}
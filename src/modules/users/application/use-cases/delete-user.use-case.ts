import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';

@Injectable()
export class DeleteUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) {}
    /**
     * Elimina un usuario del sistema.
     * @param id Identificador único del usuario.
     * @returns El usuario eliminado.
     */
    async execute(id: string) {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`El usuario con ID ${id} no fue encontrado.`);
        }

        await this.userRepository.delete(id);
        return{
            mesaage: 'Usuario eliminado correctamente'
        }
    }
}
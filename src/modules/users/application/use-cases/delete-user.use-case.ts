import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';

@Injectable()
export class DeleteUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(id: string) {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`El ususrio con ID ${id} no fue encontrado.`);
        }

        await this.userRepository.delete(id);
        return{
            mesaage: 'Usurio eliminado correctamente'
        }
    }
}
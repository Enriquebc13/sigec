import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';

@Injectable()
export class DeleteUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        await this.userRepository.delete(id);
    }
}
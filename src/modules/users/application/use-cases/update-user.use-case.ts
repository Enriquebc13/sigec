import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

 async execute(id: string, data: UpdateUserDto) {
  const user = await this.userRepository.findById(id);

  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }

  return await this.userRepository.update(id, data);
}
}
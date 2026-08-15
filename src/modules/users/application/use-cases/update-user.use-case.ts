import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserDetailResponseDto } from '../dtos/user-detail-response.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) { }
  /**
   * Actualiza los datos de un usuario existente.
   * @param id Identificador del usuario.
   * @param updateUserDto Datos que se desean actualizar.
   * @returns El usuario actualizado.
   */
  async execute(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDetailResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const updatedUser = await this.userRepository.update(id, updateUserDto);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      role: updatedUser.role,
      active: updatedUser.active,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
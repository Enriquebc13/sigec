import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IUserRepository } from "../../domain/interfaces/user.repository.interface";
import { UserDetailResponseDto } from "../dtos/user-detail-response.dto";
import { Role } from "generated/prisma/enums";
import { use } from "passport";

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) { }
 /**
  * Busca un usuario por su identificador.
  * @param id Identificador único del usuario.
  * @returns El usuario encontrado.
  */
  async execute(id: string): Promise<UserDetailResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
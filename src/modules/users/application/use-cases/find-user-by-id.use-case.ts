import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IUserRepository } from "../../domain/interfaces/user.repository.interface";
import { UserResponseDto } from "../dtos/user-response.dto";

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
        throw new NotFoundException('Usuario no encontrado')
    }
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
    };
  }
}
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IUserRepository } from "../../domain/interfaces/user.repository.interface";

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
        throw new NotFoundException('Usuario no encontrado')
    }
    return user;
  }
}
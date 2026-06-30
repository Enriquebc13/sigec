import { Inject, Injectable } from "@nestjs/common";
import type { IUserRepository } from "../../domain/interfaces/user.repository.interface";
import { UserResponseDto } from "../dtos/user-response.dto";

@Injectable()
export class GetAllUsersUseCase {

    constructor(@Inject('IUserRepository')
    private readonly userRepository: IUserRepository) { }

    async execute(): Promise<UserResponseDto[]> {
        return await this.userRepository.findAll();
    }
}
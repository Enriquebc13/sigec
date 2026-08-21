import { Inject, Injectable } from "@nestjs/common";
import type { IUserRepository } from "../../domain/interfaces/user.repository.interface";
import { UserDetailResponseDto } from "../dtos/user-detail-response.dto";

@Injectable()
export class GetAllUsersUseCase {

    constructor(@Inject('IUserRepository')
    private readonly userRepository: IUserRepository) { }
    /**
     * Obtiene todos los usuarios registrados.
     * @returns Lista de usuarios registrados.
     */
    async execute(): Promise<UserDetailResponseDto[]> {
        const users = await this.userRepository.findAll();
        return users.map(({ id, name, lastname, email, role, active, createdAt, updatedAt }) => ({
            id,
            name,
            lastname,
            email,
            role,
            active,
            createdAt,
            updatedAt
        }));
    }
}
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../dtos/user-response.dto';
import { Inject, Injectable } from '@nestjs/common';

//Estructura de datos que ocupa el caso de uso
export interface ICreateUserInput {
    email: string;
    name: string;
    lastname: string;
    password: string;
    role: 'ADMIN' | 'CLIENT';
}
@Injectable()

export class CreateUserUseCase {
    
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository
    ) {}
   /**
    * Crea un nuevo usuario en el sistema.
    * @param input Datos dl usuario que se desea registrar.
    * @returns Información del usuario creado
    */
    async execute(input: ICreateUserInput): Promise<UserResponseDto> {

        const hashedPassword = await bcrypt.hash(input.password, 10);
        //Se arma el nuevo usuario con los datos recibidos
        const newUser = new User(
            crypto.randomUUID(),
            input.email,
            input.name,
            input.lastname,
            hashedPassword,
            input.role,
            true,
            new Date(),
            new Date(),
        );
        //Guardar usuario
        const createdUser = await this.userRepository.create(newUser);

        return {
            id: createdUser.id,
            name: createdUser.name,
            lastname: createdUser.lastname,
            email: createdUser.email,
        };
    }
}
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

//Estructura de datos que ocupa el caso de uso
export interface ICreateUserInput {
    email: string;
    name: string;
    lastname: string;
    password: string;
    role: 'ADMIN' | 'CLIENT';
}

export class CreateUserUseCase {

    constructor(private readonly userRepository: IUserRepository) { }

    async execute(input: ICreateUserInput): Promise<User> {

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
        return this.userRepository.create(newUser);
    }
}
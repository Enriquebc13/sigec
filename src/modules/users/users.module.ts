import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserController } from './infrastructure/controllers/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from './application/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';


@Module({
    controllers: [UserController],
    providers: [
        PrismaService,
        {
            provide: 'IUserRepository',
            useClass: PrismaUserRepository,
        },
          CreateUserUseCase, 
          GetAllUsersUseCase,
          GetUserByIdUseCase,
          UpdateUserUseCase,
          DeleteUserUseCase,
    ],

    exports: ['IUserRepository'],
})
export class UsersModule { }
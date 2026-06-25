import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserController } from './infrastructure/controllers/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';


@Module({
    controllers: [UserController],
    providers: [
        PrismaService,
        {
            provide: 'IUserRepository',
            useClass: PrismaUserRepository,
        },
        {
            provide: CreateUserUseCase,
            useFactory: (userRepo: PrismaUserRepository) => new CreateUserUseCase(userRepo),
            inject: ['IUserRepository'],
        },
    ],

    exports: ['IUserRepository'],
})
export class UsersModule { }
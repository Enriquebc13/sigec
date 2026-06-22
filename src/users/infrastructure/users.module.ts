import { Module } from '@nestjs/common';
import { PrismaUserRepository } from './prisma-user.repository';
import { CreateUserUseCase } from '../application/create-user.use-case';
import { PrismaService } from 'src/prisma.service';
import { UserController } from './user.controller';

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
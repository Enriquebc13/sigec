import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';

@Controller('users')
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getAllUsersUseCase: GetAllUsersUseCase,

    ) { }

    @Public()
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.createUserUseCase.execute(createUserDto);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get()
    async findAll() {
        return await this.getAllUsersUseCase.execute();
    }
}
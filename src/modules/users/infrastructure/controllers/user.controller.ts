import { Controller, Post, Body, Get, UseGuards, Param, Put, Patch } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { GetUserByIdUseCase } from '../../application/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';

@Controller('users')
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getAllUsersUseCase: GetAllUsersUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,

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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.getUserByIdUseCase.execute(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.updateUserUseCase.execute(id, updateUserDto);
    }
}
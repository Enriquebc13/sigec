import { Controller, Post, Body, Get, Param, Patch, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { Public } from '../../../auth/infrastructure/decorators/public.decorator';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';

@Controller('users')
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getAllUsersUseCase: GetAllUsersUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,

    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        return this.deleteUserUseCase.execute(id);
    }

}
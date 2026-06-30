import { Controller, Post, Body, Get, Param, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { GetUserByIdUseCase } from '../../application/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';

@Controller('users')
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getAllUsersUseCase: GetAllUsersUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,

    ) { }

    @Public()
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.createUserUseCase.execute(createUserDto);
    }

    @Roles('ADMIN')
    @Get()
    async findAll() {
        return await this.getAllUsersUseCase.execute();
    }

    @Roles('ADMIN')
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.getUserByIdUseCase.execute(id);
    }

    @Roles('ADMIN')
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.updateUserUseCase.execute(id, updateUserDto);
    }

    @Roles('ADMIN')
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        return this.deleteUserUseCase.execute(id);
    }

}
import { Controller, Post, Body, Get, Param, Patch, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { GetUserByIdUseCase } from '../../application/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from '../../domain/entities/user.entity';

@ApiBearerAuth()
@ApiTags("Users")
@Controller('users')
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getAllUsersUseCase: GetAllUsersUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,

    ) { }

    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiCreatedResponse({ type: User })
    @ApiBody({
        description: 'Datos para registrar un nuevo usuario',
        type: CreateUserDto,
    })
    @Public()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.createUserUseCase.execute(createUserDto);
    }

    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @ApiOkResponse({ type: [User] })  //indican que devuelve una lista de usuarios.
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get()
    async findAll() {
        return await this.getAllUsersUseCase.execute();
    }

    @ApiOperation({ summary: 'Obtener usuario por ID' })
    @ApiParam({
        type: 'string',
        name: 'id',
        description: 'Id del usuario',
        example: 'abc123',
    })
    @ApiOkResponse({ type: User })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.getUserByIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Actualizar un usuario' })
    @ApiParam({
        type: 'string',
        name: 'id',
        description: 'Id del usuario',
    })
    @ApiBody({
        description: 'Datos del usuario a actualizar',
        type: UpdateUserDto,
    })
    @ApiOkResponse({
        type: User,
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.updateUserUseCase.execute(id, updateUserDto);
    }

    @ApiOperation({ summary: 'Eliminar usuario' })
    @ApiParam({
        type: 'string',
        name: 'id',
        description: 'Id del usuario',
        example: 'abc123',
    })
    @ApiOkResponse({ type: User })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        return this.deleteUserUseCase.execute(id);
    }
}
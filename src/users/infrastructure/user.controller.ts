import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserUseCase } from '../application/create-user.use-case';
import { CreateUserDto } from './dtos/create-user.dto';
import { Public } from 'src/auth/infrastructure/decorators/public.decorator';

@Controller('users')
export class UserController {
    constructor(private readonly createUserUseCase: CreateUserUseCase) { }

    @Public()
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.createUserUseCase.execute(createUserDto);
    }
}
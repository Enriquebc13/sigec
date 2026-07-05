import { Controller, Post, Body } from '@nestjs/common';
import { CreateRequestUseCase } from '../../application/use-cases/create-request.use-case';
import { CreateRequestDto } from '../../application/dtos/create-request.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';

@Controller('requests')
export class RequestController {
  constructor(private readonly createRequestUseCase: CreateRequestUseCase) {}

  @Public()
  @Post()
  async create(@Body() createRequestDto: CreateRequestDto) {
    return await this.createRequestUseCase.execute(createRequestDto);
  }
}
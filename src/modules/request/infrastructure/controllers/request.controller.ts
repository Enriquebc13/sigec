import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CreateRequestUseCase } from '../../application/use-cases/create-request.use-case';
import { CreateRequestDto } from '../../application/dtos/create-request.dto';

@Controller('requests')
export class RequestController {
  constructor(private readonly createRequestUseCase: CreateRequestUseCase) {}

  @Post()
  async create(@Body() createRequestDto: CreateRequestDto) {
    return await this.createRequestUseCase.execute(createRequestDto);
  }
}
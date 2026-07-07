import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { CreateRequestUseCase } from '../../application/use-cases/create-request.use-case';
import { CreateRequestDto } from '../../application/dtos/create-request.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import {JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import  { GetAllRequestHistoryUseCase } from '../../application/use-cases/get-all-request-history.use-case';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';

@Controller('requests')
export class RequestController {
  constructor(
    private readonly createRequestUseCase: CreateRequestUseCase,
    private readonly getAllRequestHistoryUseCase: GetAllRequestHistoryUseCase,
  ) { }

  // @Public()
  // @Post()
  // async create(@Body() createRequestDto: CreateRequestDto) {
  //   return await this.createRequestUseCase.execute(createRequestDto);
  // }
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreateRequestDto,
    @Request() req
  ) {
    console.log(req.user);
    return this.createRequestUseCase.execute(
      dto,
      req.user.userId
    );
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('history')
  async getHistory() {
    return this.getAllRequestHistoryUseCase.execute();
  }
}
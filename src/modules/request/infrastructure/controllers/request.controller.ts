import { Controller, Post, Body, Request, UseGuards, Get, Patch, Param } from '@nestjs/common';
import { CreateRequestUseCase } from '../../application/use-cases/create-request.use-case';
import { CreateRequestDto } from '../../application/dtos/create-request.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { GetAllRequestHistoryUseCase } from '../../application/use-cases/get-all-request-history.use-case';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { GetMyRequestsUseCase } from '../../application/use-cases/get-my-requests.use-case';
import { UpdateRequestStatusDto } from '../../application/dtos/update-request-status.dto';
import { UpdateRequestStatusUseCase } from '../../application/use-cases/update-request-status.use-case';

@Controller('requests')
export class RequestController {
  constructor(
    private readonly createRequestUseCase: CreateRequestUseCase,
    private readonly getAllRequestHistoryUseCase: GetAllRequestHistoryUseCase,
    private readonly getMyRequestsUseCase: GetMyRequestsUseCase,
    private readonly updateRequestStatusUseCase: UpdateRequestStatusUseCase,
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

  @UseGuards(JwtAuthGuard)
  @Get('my-requests')
  async getMyRequests(@Request() req) {
    return this.getMyRequestsUseCase.execute(req.user.userId);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRequestStatusDto,
    @Request() req,
  ) {
    return this.updateRequestStatusUseCase.execute(id, dto.status, req.user.userId);
  }
}
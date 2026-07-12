import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RequestController } from './infrastructure/controllers/request.controller';
import { CreateRequestUseCase } from './application/use-cases/create-request.use-case';
import { PrismaRequestRepository } from './infrastructure/repositories/prisma-request.repository';
import { PrismaRequestHistoryRepository } from './infrastructure/repositories/prisma-request-history.repository';
import { GetAllRequestHistoryUseCase } from './application/use-cases/get-all-request-history.use-case';
import { GetMyRequestsUseCase } from './application/use-cases/get-my-requests.use-case';
import { UpdateRequestStatusUseCase } from './application/use-cases/update-request-status.use-case';

@Module({
  controllers: [RequestController],
  providers: [
    PrismaService,
    {
      provide: 'IRequestRepository',
      useClass: PrismaRequestRepository,
    },
    {
      provide: 'IRequestHistoryRepository',
      useClass: PrismaRequestHistoryRepository,
    },

    CreateRequestUseCase,
    GetAllRequestHistoryUseCase,
    GetMyRequestsUseCase,
    UpdateRequestStatusUseCase

  ],
  exports: ['IRequestRepository'],
})
export class RequestModule { }
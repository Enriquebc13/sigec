import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RequestController } from './infrastructure/controllers/request.controller';
import { CreateRequestUseCase } from './application/use-cases/create-request.use-case';
import { PrismaRequestRepository } from './infrastructure/repositories/prisma-request.repository';

@Module({
  controllers: [RequestController],
  providers: [
    PrismaService,
    {
      provide: 'IRequestRepository',
      useClass: PrismaRequestRepository,
    },
    {
      provide: CreateRequestUseCase,
      useFactory: (requestRepo: PrismaRequestRepository) =>
        new CreateRequestUseCase(requestRepo),
      inject: ['IRequestRepository'],
    },
  ],
  exports: ['IRequestRepository'],
})
export class RequestModule {}
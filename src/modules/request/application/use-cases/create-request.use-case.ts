import type{ IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { Request } from '../../domain/entities/request.entity';
import { RequestResponseDto } from '../dtos/request-response.dto';
import type { IRequestHistoryRepository } from '../../domain/interfaces/request-history.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { RequestStatus } from 'generated/prisma/enums';

export interface ICreateRequestInput {

  telefono: string;
  propertyId: string;
}
@Injectable()
export class CreateRequestUseCase {
  constructor(
    @Inject('IRequestRepository')
    private readonly requestRepository: IRequestRepository,

    @Inject('IRequestHistoryRepository')
    private readonly requestHistoryRepository: IRequestHistoryRepository,
  ) {}

  async execute(
    input: ICreateRequestInput,
    userId: string
  ): Promise<RequestResponseDto> {
    const newRequest = new Request(
      crypto.randomUUID(),
      input.telefono,
      userId,
      input.propertyId,
      RequestStatus.PENDING,
      new Date(),
    );

    const created = await this.requestRepository.create(newRequest);
    await this.requestHistoryRepository.create({

      id: crypto.randomUUID(),
      action: 'CREATED',
      requestId: created.id,
      userId: userId,
      changedAt: new Date()
    });

    return {
      id: created.id,
      telefono: created.telefono,
      userId: created.userId,
      propertyId: created.propertyId,
      status: created.status,
      createdAt: created.createdAt,
    };
  }
}
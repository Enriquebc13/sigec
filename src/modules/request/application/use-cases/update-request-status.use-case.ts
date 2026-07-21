import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import type { IRequestHistoryRepository } from '../../domain/interfaces/request-history.repository.interface';
import { RequestResponseDto } from '../dtos/request-response.dto';

@Injectable()
export class UpdateRequestStatusUseCase {
  constructor(
    @Inject('IRequestRepository')
    private readonly requestRepository: IRequestRepository,

    @Inject('IRequestHistoryRepository')
    private readonly requestHistoryRepository: IRequestHistoryRepository,
  ) {}

  async execute(
    requestId: string,
    newStatus: 'APPROVED' | 'REJECTED',
    userId: string,
  ): Promise<RequestResponseDto> {
    const existing = await this.requestRepository.findById(requestId);
    if (!existing) {
      throw new NotFoundException(`Solicitud ${requestId} no encontrada`);
    }

    const updated = await this.requestRepository.updateStatus(requestId, newStatus);

    await this.requestHistoryRepository.create({
      id: crypto.randomUUID(),
      action: newStatus,
      requestId: updated.id,
      userId,
      changedAt: new Date(),
    });

    return {
      id: updated.id,
      telefono: updated.telefono,
      userId: updated.userId,
      propertyId: updated.propertyId,
      status: updated.status,
      createdAt: updated.createdAt,
    };
  }
}
import type{ IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { RequestEntity } from '../../domain/entities/request.entity';
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

  /**
   * Crea una nueva solicitud con estado inicial PENDING y registra el evento
   * de creación en el historial de solicitudes.
   * @param input - Datos necesarios para crear la solicitud (teléfono y propiedad).
   * @param userId - ID del usuario que genera la solicitud.
   * @returns {Promise<RequestResponseDto>} La solicitud creada, con su ID y estado.
   */
  async execute(
    input: ICreateRequestInput,
    userId: string
  ): Promise<RequestResponseDto> {
    const newRequest = new RequestEntity(
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
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

  /**
   * Actualiza el estado de una solicitud existente (aprobada o rechazada)
   * y registra el cambio en el historial de solicitudes.
   * @param requestId - ID de la solicitud a actualizar.
   * @param newStatus - Nuevo estado a asignar ('APPROVED' o 'REJECTED').
   * @param userId - ID del usuario (ADMIN) que realiza el cambio.
   * @throws {NotFoundException} Si la solicitud no existe.
   * @returns {Promise<RequestResponseDto>} La solicitud con su estado actualizado.
   */
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
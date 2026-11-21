import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PropertyStatus, RequestStatus } from 'generated/prisma/enums';
import type { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import type { IRequestHistoryRepository } from '../../domain/interfaces/request-history.repository.interface';
import { RequestResponseDto } from '../dtos/request-response.dto';

/**
 * Estado al que pasa la propiedad cuando se aprueba una solicitud.
 * (RENTED lo pone el admin a mano, al firmar el contrato, vía PUT /properties/:id.)
 */
export const PROPERTY_STATUS_ON_APPROVAL: PropertyStatus = PropertyStatus.RESERVED;

@Injectable()
export class UpdateRequestStatusUseCase {
  constructor(
    @Inject('IRequestRepository')
    private readonly requestRepository: IRequestRepository,

    @Inject('IRequestHistoryRepository')
    private readonly requestHistoryRepository: IRequestHistoryRepository,
  ) {}

  /**
   * Cambia el estado de una solicitud respetando estas transiciones:
   *
   * - PENDING  -> APPROVED : aprueba y pasa la propiedad AVAILABLE -> RESERVED
   *                          (transacción). Las demás PENDING siguen en la fila.
   * - PENDING  -> REJECTED : solo rechaza esta; las siguientes suben de puesto
   *                          por el conteo dinámico.
   * - APPROVED -> REJECTED : el trato se cayó; la propiedad vuelve a AVAILABLE
   *                          si seguía RESERVED (transacción).
   * - Cualquier otra transición (incluida reabrir una REJECTED) -> 409.
   *
   * @param requestId - ID de la solicitud.
   * @param newStatus - 'APPROVED' o 'REJECTED'.
   * @param userId - ID del ADMIN que realiza el cambio.
   * @throws {NotFoundException} Si la solicitud no existe.
   * @throws {ConflictException} Si la transición no es válida o la propiedad no está AVAILABLE.
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

    let result;

    if (existing.status === RequestStatus.PENDING && newStatus === RequestStatus.APPROVED) {
      result = await this.requestRepository.approve(requestId, userId, PROPERTY_STATUS_ON_APPROVAL);
    } else if (existing.status === RequestStatus.PENDING && newStatus === RequestStatus.REJECTED) {
      result = await this.requestRepository.updateStatus(requestId, RequestStatus.REJECTED);
      await this.requestHistoryRepository.create({
        id: crypto.randomUUID(),
        action: RequestStatus.REJECTED,
        requestId: result.id,
        userId,
        changedAt: new Date(),
      });
    } else if (existing.status === RequestStatus.APPROVED && newStatus === RequestStatus.REJECTED) {
      result = await this.requestRepository.rejectApproved(requestId, userId);
    } else {
      throw new ConflictException(
        `No se puede cambiar una solicitud ${this.label(existing.status)} a ${this.label(newStatus)}.`,
      );
    }

    return {
      id: result.id,
      telefono: result.telefono,
      userId: result.userId,
      propertyId: result.propertyId,
      status: result.status,
      createdAt: result.createdAt,
      posicionListaEspera: null,
    };
  }

  private label(status: RequestStatus | string): string {
    return { PENDING: 'pendiente', APPROVED: 'aprobada', REJECTED: 'rechazada' }[status] ?? status;
  }
}

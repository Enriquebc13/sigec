import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RequestStatus } from 'generated/prisma/enums';
import type { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { RequestResponseDto } from '../dtos/request-response.dto';

@Injectable()
export class CancelRequestUseCase {
  constructor(
    @Inject('IRequestRepository')
    private readonly requestRepository: IRequestRepository,
  ) {}

  /**
   * El solicitante cancela su propia solicitud PENDING (sale de la lista de
   * espera y los demás suben de lugar). Una solicitud aprobada tiene la
   * propiedad reservada: para cancelarla debe contactar al administrador.
   * @throws {NotFoundException} Si la solicitud no existe.
   * @throws {ForbiddenException} Si no es del usuario autenticado.
   * @throws {ConflictException} Si ya no está pendiente.
   */
  async execute(requestId: string, userId: string): Promise<RequestResponseDto> {
    const existing = await this.requestRepository.findById(requestId);
    if (!existing) throw new NotFoundException('Solicitud no encontrada');
    if (existing.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para cancelar esta solicitud');
    }
    if (existing.status !== RequestStatus.PENDING) {
      throw new ConflictException(
        existing.status === RequestStatus.APPROVED
          ? 'Una solicitud aprobada no se puede cancelar desde aquí. Contacta al administrador.'
          : 'La solicitud ya no está pendiente.',
      );
    }

    const cancelled = await this.requestRepository.cancel(requestId, userId);
    return {
      id: cancelled.id,
      telefono: cancelled.telefono,
      userId: cancelled.userId,
      propertyId: cancelled.propertyId,
      status: cancelled.status,
      createdAt: cancelled.createdAt,
      posicionListaEspera: null,
      cancelledByApplicant: true,
    };
  }
}

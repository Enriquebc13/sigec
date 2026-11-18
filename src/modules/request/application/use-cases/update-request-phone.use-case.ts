import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RequestStatus } from 'generated/prisma/enums';
import type { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { RequestResponseDto } from '../dtos/request-response.dto';
import { resolveWaitlistPosition } from '../helpers/waitlist-position';

@Injectable()
export class UpdateRequestPhoneUseCase {
  constructor(
    @Inject('IRequestRepository')
    private readonly requestRepository: IRequestRepository,
  ) {}

  /**
   * El solicitante corrige su teléfono de contacto mientras la solicitud esté
   * PENDING o APPROVED. No cambia su lugar en la lista de espera.
   * @throws {NotFoundException} Si la solicitud no existe.
   * @throws {ForbiddenException} Si no es del usuario autenticado.
   * @throws {ConflictException} Si la solicitud está rechazada o cancelada.
   */
  async execute(
    requestId: string,
    telefono: string,
    userId: string,
  ): Promise<RequestResponseDto> {
    const existing = await this.requestRepository.findById(requestId);
    if (!existing) throw new NotFoundException('Solicitud no encontrada');
    if (existing.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para editar esta solicitud');
    }
    if (existing.status === RequestStatus.REJECTED) {
      throw new ConflictException(
        'No se puede editar el teléfono de una solicitud rechazada o cancelada.',
      );
    }

    const updated = await this.requestRepository.updatePhone(requestId, telefono.trim(), userId);
    return {
      id: updated.id,
      telefono: updated.telefono,
      userId: updated.userId,
      propertyId: updated.propertyId,
      status: updated.status,
      createdAt: updated.createdAt,
      posicionListaEspera: await resolveWaitlistPosition(this.requestRepository, updated),
    };
  }
}

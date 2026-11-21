import { Inject, Injectable } from '@nestjs/common';
import type { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { RequestResponseDto } from '../dtos/request-response.dto';
import { resolveWaitlistPosition } from '../helpers/waitlist-position';

@Injectable()
export class GetMyRequestsUseCase {
  constructor(
    @Inject('IRequestRepository')
    private readonly requestRepository: IRequestRepository,
  ) {}

  /**
   * Obtiene las solicitudes del usuario autenticado, cada una con su
   * `posicionListaEspera` (solo su propio puesto; nunca datos de otros usuarios).
   * @param userId - ID del usuario autenticado cuyas solicitudes se buscan.
   * @returns {Promise<RequestResponseDto[]>} Listado de solicitudes del usuario.
   */
  async execute(userId: string): Promise<RequestResponseDto[]> {
    const requests = await this.requestRepository.findByUserId(userId);

    return Promise.all(
      requests.map(async (r) => ({
        id: r.id,
        telefono: r.telefono,
        userId: r.userId,
        propertyId: r.propertyId,
        status: r.status,
        createdAt: r.createdAt,
        posicionListaEspera: await resolveWaitlistPosition(this.requestRepository, r),
        cancelledByApplicant: r.cancelledByApplicant ?? false,
      })),
    );
  }
}

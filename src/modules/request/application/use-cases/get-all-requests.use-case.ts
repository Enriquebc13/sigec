import { Inject, Injectable } from '@nestjs/common';
import type {
  IRequestRepository,
  RequestFilters,
} from '../../domain/interfaces/request.repository.interface';
import { AdminRequestResponseDto } from '../dtos/request-response.dto';
import { resolveWaitlistPosition } from '../helpers/waitlist-position';

@Injectable()
export class GetAllRequestsUseCase {
  constructor(
    @Inject('IRequestRepository')
    private readonly requestRepository: IRequestRepository,
  ) {}

  /**
   * Listado administrativo de solicitudes. Con `propertyId` sirve como vista
   * de las solicitudes de un inmueble (detalle de propiedad); con
   * `status=PENDING` muestra solo la fila de espera. Uso exclusivo ADMIN.
   * @param filters - propertyId y/o status opcionales.
   */
  async execute(filters: RequestFilters = {}): Promise<AdminRequestResponseDto[]> {
    const requests = await this.requestRepository.findAllWithRelations(filters);

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
        applicant: r.user,
        property: r.property,
      })),
    );
  }
}

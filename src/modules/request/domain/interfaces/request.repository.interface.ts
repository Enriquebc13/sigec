import { PropertyStatus, RequestStatus } from 'generated/prisma/enums';
import { RequestEntity } from '../entities/request.entity';

/** Filtros opcionales para el listado administrativo de solicitudes. */
export interface RequestFilters {
  propertyId?: string;
  status?: RequestStatus;
}

/** Solicitud con los datos del solicitante y de la propiedad (uso admin). */
export interface RequestWithRelations extends RequestEntity {
  user: { id: string; name: string; lastname: string; email: string };
  property: { id: string; title: string; status: PropertyStatus };
}

export interface IRequestRepository {
  create(RequestEntity: RequestEntity): Promise<RequestEntity>;
  findById(id: string): Promise<RequestEntity | null>;
  findAll(): Promise<RequestEntity[]>;
  findAllWithRelations(filters?: RequestFilters): Promise<RequestWithRelations[]>;
  findByUserId(userId: string): Promise<RequestEntity[]>;
  updateStatus(id: string, status: RequestStatus): Promise<RequestEntity>;
  delete(id: string): Promise<void>; // Elimina una solicitud por su ID

  /**
   * Posición en la lista de espera: cuenta las solicitudes PENDING de la misma
   * propiedad con createdAt <= al de la solicitud indicada (ella misma incluida).
   */
  countPendingUpTo(propertyId: string, createdAt: Date): Promise<number>;

  /**
   * Aprueba una solicitud PENDING y pasa la propiedad de AVAILABLE a
   * `propertyStatus`, en UNA transacción (incluye historial).
   * No toca las demás solicitudes: siguen PENDING como respaldo.
   */
  approve(
    requestId: string,
    adminUserId: string,
    propertyStatus: PropertyStatus,
  ): Promise<RequestEntity>;

  /**
   * Rechaza una solicitud APPROVED (el trato se cayó) y, si la propiedad está
   * RESERVED, la regresa a AVAILABLE, en UNA transacción (incluye historial).
   */
  rejectApproved(requestId: string, adminUserId: string): Promise<RequestEntity>;

  /**
   * El propio solicitante cancela su solicitud PENDING: queda REJECTED y el
   * historial registra al solicitante como autor (así se distingue de un
   * rechazo del admin). En UNA transacción. Sale de la fila de espera.
   */
  cancel(requestId: string, userId: string): Promise<RequestEntity>;

  /**
   * El solicitante corrige su teléfono (solo si la solicitud está PENDING o
   * APPROVED). Registra el evento UPDATED en el historial, en UNA transacción.
   */
  updatePhone(requestId: string, telefono: string, userId: string): Promise<RequestEntity>;
}

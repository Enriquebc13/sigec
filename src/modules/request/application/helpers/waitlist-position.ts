import { RequestStatus } from 'generated/prisma/enums';
import type { IRequestRepository } from '../../domain/interfaces/request.repository.interface';

/**
 * Calcula la posición en la lista de espera de una solicitud.
 * - PENDING  -> número (1 = primero en la fila)
 * - APPROVED / REJECTED -> null (ya no está en la fila)
 */
export async function resolveWaitlistPosition(
  repository: IRequestRepository,
  request: { propertyId: string; status: RequestStatus; createdAt: Date },
): Promise<number | null> {
  if (request.status !== RequestStatus.PENDING) return null;
  return repository.countPendingUpTo(request.propertyId, request.createdAt);
}

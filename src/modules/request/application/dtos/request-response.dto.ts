import { RequestStatus } from 'generated/prisma/enums';

export class RequestResponseDto {
  id: string;
  telefono: string;
  userId: string;
  propertyId: string;
  status: RequestStatus;
  createdAt: Date;

  /**
   * Puesto actual en la lista de espera de la propiedad (1 = primero).
   * Solo existe mientras la solicitud está PENDING; en otro caso es null.
   */
  posicionListaEspera?: number | null;

  /**
   * true si la solicitud está REJECTED porque el propio solicitante la canceló
   * (el rechazo lo registró él mismo en el historial, no un admin).
   */
  cancelledByApplicant?: boolean;
}

/** Respuesta del listado administrativo (incluye datos para contactar). */
export class AdminRequestResponseDto extends RequestResponseDto {
  applicant: { id: string; name: string; lastname: string; email: string };
  property: { id: string; title: string; status: string };
}

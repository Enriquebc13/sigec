import { RequestStatus } from '../../domain/entities/request.entity';

export class RequestResponseDto {
  id: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  correo: string;
  propertyId: string;
  status: RequestStatus;
  createdAt: Date;
}
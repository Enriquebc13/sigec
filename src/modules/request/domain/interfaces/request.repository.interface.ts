import { RequestStatus } from 'generated/prisma/enums';
import { RequestEntity } from '../entities/request.entity';

export interface IRequestRepository {
  create(RequestEntity: RequestEntity): Promise<RequestEntity>;
  findById(id: string): Promise<RequestEntity | null>;
  findAll(): Promise<RequestEntity[]>;
  findByUserId(userId: string): Promise<RequestEntity[]>;
  updateStatus(id: string, status: RequestStatus): Promise<RequestEntity>;
  delete(id: string): Promise<void>; // Elimina una solicitud por su ID
}
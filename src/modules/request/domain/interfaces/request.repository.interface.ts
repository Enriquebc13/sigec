import { RequestStatus } from 'generated/prisma/enums';
import { Request } from '../entities/request.entity';

export interface IRequestRepository {
  create(request: Request): Promise<Request>;
  findById(id: string): Promise<Request | null>;
  findAll(): Promise<Request[]>;
  findByUserId(userId: string): Promise<Request[]>;
  updateStatus(id: string, status: RequestStatus): Promise<Request>;
}
import { RequestStatus } from '../../domain/entities/request.entity';

export class RequestResponseDto {
  id: string;
  userId: string;
  propertyId: string;
  status: RequestStatus;
  createdAt: Date;
}
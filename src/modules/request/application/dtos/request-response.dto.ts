import { RequestStatus } from 'generated/prisma/enums';

export class RequestResponseDto {
  id: string;
  telefono: string;
  userId: string;
  propertyId: string;
  status: RequestStatus;
  createdAt: Date;
}
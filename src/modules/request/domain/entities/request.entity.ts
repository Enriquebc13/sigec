export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLIST';

export class Request {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly propertyId: string,
    public readonly status: RequestStatus,
    public readonly createdAt: Date,
  ) {}
}
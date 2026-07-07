export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLIST';

export class Request {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly apellidos: string,
    public readonly telefono: string,
    public readonly correo: string,
    public readonly propertyId: string,
    public readonly status: RequestStatus,
    public readonly createdAt: Date,
  ) {}
}
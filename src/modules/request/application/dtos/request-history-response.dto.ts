export class RequestHistoryResponseDto {
  id: string;
  action: string;
  changedAt: Date;
  requestId: string;
  user: {
    id: string;
    name: string;
    lastname: string;
    email: string;
  };
  request: {
    id: string;
    nombre: string;
    apellidos: string;
    status: string;
  };
}
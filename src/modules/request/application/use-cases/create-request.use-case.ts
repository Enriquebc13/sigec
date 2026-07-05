import { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { Request } from '../../domain/entities/request.entity';
import { RequestResponseDto } from '../dtos/request-response.dto';

export interface ICreateRequestInput {
  nombre: string;
  apellidos: string;
  telefono: string;
  correo: string;
  propertyId: string;
}

export class CreateRequestUseCase {
  constructor(private readonly requestRepository: IRequestRepository) {}

  async execute(input: ICreateRequestInput): Promise<RequestResponseDto> {
    const newRequest = new Request(
      crypto.randomUUID(),
      input.nombre,
      input.apellidos,
      input.telefono,
      input.correo,
      input.propertyId,
      'PENDING',
      new Date(),
    );

    const created = await this.requestRepository.create(newRequest);

    return {
      id: created.id,
      nombre: created.nombre,
      apellidos: created.apellidos,
      telefono: created.telefono,
      correo: created.correo,
      propertyId: created.propertyId,
      status: created.status,
      createdAt: created.createdAt,
    };
  }
}
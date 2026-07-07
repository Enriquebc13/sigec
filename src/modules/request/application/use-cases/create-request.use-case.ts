import type{ IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { Request } from '../../domain/entities/request.entity';
import { RequestResponseDto } from '../dtos/request-response.dto';
import type { IRequestHistoryRepository } from '../../domain/interfaces/request-history.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

export interface ICreateRequestInput {
  nombre: string;
  apellidos: string;
  telefono: string;
  correo: string;
  propertyId: string;
}
@Injectable()
export class CreateRequestUseCase {
  constructor(
    @Inject('IRequestRepository')
    private readonly requestRepository: IRequestRepository,

    @Inject('IRequestHistoryRepository')
    private readonly requestHistoryRepository: IRequestHistoryRepository,
  ) {}

  async execute(
    input: ICreateRequestInput,
    userId: string
  ): Promise<RequestResponseDto> {
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
    await this.requestHistoryRepository.create({

      id: crypto.randomUUID(),
      action: 'CREATED',
      requestId: created.id,
      userId: userId,
      changedAt: new Date()
    });

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
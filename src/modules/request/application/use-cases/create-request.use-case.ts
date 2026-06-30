import { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { Request } from '../../domain/entities/request.entity';
import { RequestResponseDto } from '../dtos/request-response.dto';

export interface ICreateRequestInput {
  userId: string;
  propertyId: string;
}

export class CreateRequestUseCase {
  constructor(private readonly requestRepository: IRequestRepository) {}

  async execute(input: ICreateRequestInput): Promise<RequestResponseDto> {
    const newRequest = new Request(
      crypto.randomUUID(),
      input.userId,
      input.propertyId,
      'PENDING',
      new Date(),
    );

    const created = await this.requestRepository.create(newRequest);

    return {
      id: created.id,
      userId: created.userId,
      propertyId: created.propertyId,
      status: created.status,
      createdAt: created.createdAt,
    };
  }
}
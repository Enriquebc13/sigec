import { Inject, Injectable } from '@nestjs/common';
import type { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { RequestResponseDto } from '../dtos/request-response.dto';

@Injectable()
export class GetMyRequestsUseCase {
  constructor(
    @Inject('IRequestRepository')
    private readonly requestRepository: IRequestRepository,
  ) {}

  async execute(userId: string): Promise<RequestResponseDto[]> {
    return this.requestRepository.findByUserId(userId) as unknown as Promise<RequestResponseDto[]>;
  }
}
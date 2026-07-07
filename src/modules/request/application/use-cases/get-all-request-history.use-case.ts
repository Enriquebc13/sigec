import { Inject, Injectable } from '@nestjs/common';
import type { IRequestHistoryRepository } from '../../domain/interfaces/request-history.repository.interface';
import { RequestHistoryResponseDto } from '../dtos/request-history-response.dto';

@Injectable()
export class GetAllRequestHistoryUseCase {
  constructor(
    @Inject('IRequestHistoryRepository')
    private readonly repository: IRequestHistoryRepository,
  ) {}

  async execute(): Promise<RequestHistoryResponseDto[]> {
    return this.repository.findAll() as unknown as Promise<RequestHistoryResponseDto[]>;
  }
}
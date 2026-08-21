import { Inject, Injectable } from '@nestjs/common';
import type { IRequestHistoryRepository } from '../../domain/interfaces/request-history.repository.interface';
import { RequestHistoryResponseDto } from '../dtos/request-history-response.dto';

@Injectable()
export class GetAllRequestHistoryUseCase {
  constructor(
    @Inject('IRequestHistoryRepository')
    private readonly repository: IRequestHistoryRepository,
  ) {}

  /**
   * Obtiene el historial completo de eventos registrados sobre todas las solicitudes.
   * Pensado para uso administrativo (rol ADMIN).
   * @returns {Promise<RequestHistoryResponseDto[]>} Listado de eventos del historial.
   */
  async execute(): Promise<RequestHistoryResponseDto[]> {
    return this.repository.findAll() as unknown as Promise<RequestHistoryResponseDto[]>;
  }
}
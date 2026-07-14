import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { IRequestRepository } from '../../domain/interfaces/request.repository.interface';

@Injectable()
export class DeleteRequestUseCase {
  constructor(
    @Inject('IRequestRepository')
    private readonly requestRepository: IRequestRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    // Buscar la solicitud por ID
    const request = await this.requestRepository.findById(id);

    // Verificar que la solicitud existe
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    // Verificar que la solicitud pertenece al usuario que quiere eliminarla
    if (request.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta solicitud');
    }

    // Eliminar la solicitud
    await this.requestRepository.delete(id);
  }
}
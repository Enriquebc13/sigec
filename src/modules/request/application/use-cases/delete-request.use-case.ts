import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { IRequestRepository } from '../../domain/interfaces/request.repository.interface';

@Injectable()
export class DeleteRequestUseCase {
  constructor(
    @Inject('IRequestRepository')
    private readonly requestRepository: IRequestRepository,
  ) {}

  /**
   * Elimina una solicitud existente, validando que pertenezca al usuario autenticado.
   * @param id - ID de la solicitud a eliminar.
   * @param userId - ID del usuario que solicita la eliminación.
   * @throws {NotFoundException} Si la solicitud no existe.
   * @throws {ForbiddenException} Si el usuario no es dueño de la solicitud.
   * @returns {Promise<void>} No retorna contenido si la operación es exitosa.
   */
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
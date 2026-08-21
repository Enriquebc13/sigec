import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPropertyRepository } from '../../domain/interfaces/property.repository.interface';

/**
 * Caso de uso que se encarga de eliminar una propiedad exixtente
 */
@Injectable()
export class DeletePropertyUseCase {
  constructor(
    @Inject('IPropertyRepository')
    private readonly propertyRepository: IPropertyRepository,
  ) { }

  /**
   * Ejecuta la eliminacion de una propiedad
   * @param id -ID de la propiedad a eliminar
   * @throws {NotFoundException} Si no existe ninguna propiedad con el id proporcionado
   */
  async execute(id: string): Promise<void> {
    const property = await this.propertyRepository.findById(id);
    if (!property) throw new NotFoundException(`Propiedad con id ${id} no encontrada`);
    await this.propertyRepository.delete(id);
  }
}
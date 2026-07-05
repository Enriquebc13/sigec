import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPropertyRepository } from '../../domain/interfaces/property.repository.interface';

@Injectable()
export class DeletePropertyUseCase {
  constructor(
    @Inject('IPropertyRepository')
    private readonly propertyRepository: IPropertyRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const property = await this.propertyRepository.findById(id);
    if (!property) throw new NotFoundException(`Propiedad con id ${id} no encontrada`);
    await this.propertyRepository.delete(id);
  }
}
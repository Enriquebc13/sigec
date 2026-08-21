import { Inject, Injectable } from '@nestjs/common';

import type { IPropertyRepository } from '../../domain/interfaces/property.repository.interface';
import type { CreatePropertyDto } from '../dtos/create-property.dto';
import type { Property } from '../../domain/entities/property.entity';
import { PropertyStatus } from 'generated/prisma/enums';

/**
 * Caso de uso que se encarga de registrar una nueva propiedad.
 * Asigna el estatus inicial de la propiedad como "AVAILABLE"
*/
@Injectable()
export class CreatePropertyUseCase {
  constructor(
    @Inject('IPropertyRepository')
    private readonly propertyRepository: IPropertyRepository,
  ) { }

  /**
   * Ejecuta el registro de una nueva propiedad
   * @param dto - Datos necesarios para crear la propiedad.
   * @returns La propiedad creada
   */
  async execute(dto: CreatePropertyDto): Promise<Property> {
    return this.propertyRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      price: dto.price,
      maintenanceCost: dto.maintenanceCost ?? null,
      dimensions: dto.dimensions ?? null,
      floor: dto.floor ?? null,
      type: dto.type,
      status: PropertyStatus.AVAILABLE,
      amenities: dto.amenities ?? null,
      userId: dto.userId,
      updatedAt: null,
      address: dto.address,
    });
  }
}
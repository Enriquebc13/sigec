import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IPropertyRepository } from "../../domain/interfaces/property.repository.interface";
import type { UpdatePropertyDto } from "../dtos/update-property.dto";
import type { Property } from "../../domain/entities/property.entity";

/**
 * Caso de uso que se encarga de actualizar una propiedad existente
 */
@Injectable()
export class UpdatePropertyUseCase {
    constructor(
        @Inject('IPropertyRepository')
        private readonly propertyRepository: IPropertyRepository,

    ) { }

    /**
     * Ejecuta la actualizacion de una propiedad existente
     * @param id - ID de la propiedad a actualizar
     * @param dto - Datos a modificar de la propiedad
     * @returns La propiedad actualizada
     * @throws {NotFoundException} Si no existe ninguna propiedad con el id proporcionado
     */
    async execute(id: string, dto: UpdatePropertyDto): Promise<Property> {
        const property = await this.propertyRepository.findById(id);
        if (!property) throw new NotFoundException(`Propiedad con id ${id} no encontrada`);
        return this.propertyRepository.update(id, dto);
    }
}
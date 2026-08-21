import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IPropertyRepository } from "../../domain/interfaces/property.repository.interface";
import type { Property } from "../../domain/entities/property.entity";

/**
 * Caso de uso que se encarga de obtener una propiedad por su ID
 */
@Injectable()
export class GetPropertyUseCase {
    constructor(
        @Inject('IPropertyRepository')
        private readonly propertyRepository: IPropertyRepository,

    ) { }

    /**
     * Ejecuta la busqueda de una propiedad por su ID
     * @param id - ID de la propiedad a buscar
     * @returns La propiedad encontrada
     * @throws {NotFoundException} Si no existe ninguna propiedad con el id proporcionado
     */
    async execute(id: string): Promise<Property> {
        const property = await this.propertyRepository.findById(id);
        if (!property) throw new NotFoundException(`Propiedad con id ${id} no encontrada`);
        return property;
    }
}
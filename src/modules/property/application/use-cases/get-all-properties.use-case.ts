import { Inject, Injectable } from "@nestjs/common";
import type { IPropertyRepository } from "../../domain/interfaces/property.repository.interface";
import type { Property } from "../../domain/entities/property.entity";

/**
 * Caso de uso que se encarga de obtener todas las propiedades registradas
 */
@Injectable()
export class GetAllPropertiesUseCase {
    constructor(
        @Inject('IPropertyRepository')
        private readonly propertyRepository: IPropertyRepository,
    ) { }

    /**
     * Ejecuta la consulta de las propiedades
     * @returns Un arreglo con todas las propiedades registradas
     */
    async execute(): Promise<Property[]> {
        return this.propertyRepository.findAll();
    }
}
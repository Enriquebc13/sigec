import { Inject, Injectable } from "@nestjs/common";
import type { IPropertyRepository } from "../../domain/interfaces/property.repository.interface";
import type { Property } from "../../domain/entities/property.entity";


@Injectable()
export class GetAllPropertiesUseCase {
    constructor(
        @Inject('IPropertyRepository')
        private readonly propertyRepository: IPropertyRepository,
    ) { }

    async execute(): Promise<Property[]> {
        return this.propertyRepository.findAll();
    }
}
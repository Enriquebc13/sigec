import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IPropertyRepository } from "../../domain/interfaces/property.repository.interface";
import type { UpdatePropertyDto } from "../dtos/update-property.dto";
import type { Property } from "../../domain/entities/property.entity";


@Injectable()
export class UpdatePropertyUseCase {
    constructor(
        @Inject('IPropertyRepository')
        private readonly propertyRepository: IPropertyRepository,

    ) { }

    async execute(id: string, dto: UpdatePropertyDto): Promise<Property> {
        const property = await this.propertyRepository.findById(id);
        if (!property) throw new NotFoundException(`Propiedad con id ${id} no encontrada`);
        return this.propertyRepository.update(id, dto);
    }
}
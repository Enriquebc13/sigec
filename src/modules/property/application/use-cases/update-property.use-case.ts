import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IPropertyRepository } from "../../domain/interfaces/property.repository.interface";
import type { UpdatePropertyDto } from "../dtos/update-property.dto";

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
     * Ejecuta la actualizacion de una propiedad existente.
     * Si el status cambia a RENTED se rechazan en lote las solicitudes PENDING;
     * si pasa de RESERVED o RENTED a AVAILABLE se rechaza la solicitud APPROVED.
     * @param id - ID de la propiedad a actualizar
     * @param dto - Datos a modificar de la propiedad
     * @param actorUserId - ID del ADMIN que hace el cambio (para el historial)
     * @returns La propiedad actualizada + `autoRejectedRequests` (solicitudes
     *          rechazadas automáticamente, con datos para avisar por WhatsApp)
     * @throws {NotFoundException} Si no existe ninguna propiedad con el id proporcionado
     */
    async execute(id: string, dto: UpdatePropertyDto, actorUserId: string) {
        const property = await this.propertyRepository.findById(id);
        if (!property) throw new NotFoundException(`Propiedad con id ${id} no encontrada`);
        const { property: updated, autoRejectedRequests } =
            await this.propertyRepository.updateWithRequestSync(id, dto, actorUserId);
        return { ...updated, autoRejectedRequests };
    }
}
import { AddressDto } from '../../application/dtos/address.dto';
import { UpdateAddressDto } from '../../application/dtos/update-address.dto';
import { Property } from '../entities/property.entity';

export interface CreatePropertyData {
  title: string;
  description: string | null;
  price: number;
  maintenanceCost: number | null;
  dimensions: string | null;
  floor: number | null;
  type: string;
  status: string;
  amenities: string | null;
  userId: string;
  updatedAt: null;
  address: AddressDto;
}

export interface UpdatePropertyData {
  title?: string;
  description?: string | null;
  price?: number;
  maintenanceCost?: number | null;
  dimensions?: string | null;
  floor?: number | null;
  type?: string;
  status?: string;
  amenities?: string | null;
  address?: UpdateAddressDto;
}

/** Solicitud que el sistema rechazó automáticamente al cambiar el estado de la propiedad. */
export interface AutoRejectedRequest {
  id: string;
  telefono: string;
  /** Estado que tenía antes de ser rechazada (PENDING por RENTED, APPROVED por liberar la reserva). */
  previousStatus: 'PENDING' | 'APPROVED';
  applicant: { id: string; name: string; lastname: string; email: string };
  propertyId: string;
  propertyTitle: string;
}

export interface UpdatePropertyResult {
  property: Property;
  autoRejectedRequests: AutoRejectedRequest[];
}

export interface IPropertyRepository {
  create(data: CreatePropertyData): Promise<Property>;
  findAll(): Promise<Property[]>;
  findById(id: string): Promise<Property | null>;
  update(id: string, data: UpdatePropertyData): Promise<Property>;

  /**
   * Igual que update, pero sincroniza las solicitudes en la MISMA transacción:
   * - status -> RENTED (desde otro estado): rechaza todas las solicitudes PENDING.
   * - status RESERVED/RENTED -> AVAILABLE: rechaza la solicitud APPROVED (reserva liberada o contrato cancelado).
   * Cada rechazo queda en el historial a nombre de `actorUserId`.
   */
  updateWithRequestSync(
    id: string,
    data: UpdatePropertyData,
    actorUserId: string,
  ): Promise<UpdatePropertyResult>;
  delete(id: string): Promise<void>;
}
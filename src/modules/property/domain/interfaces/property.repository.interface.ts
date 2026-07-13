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

export interface IPropertyRepository {
  create(data: CreatePropertyData): Promise<Property>;
  findAll(): Promise<Property[]>;
  findById(id: string): Promise<Property | null>;
  update(id: string, data: UpdatePropertyData): Promise<Property>;
  delete(id: string): Promise<void>;
}
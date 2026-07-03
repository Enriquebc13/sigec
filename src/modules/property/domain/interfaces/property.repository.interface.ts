import { Property } from '../entities/property.entity';

export interface IPropertyRepository {
  create(data: Omit<Property, 'id' | 'createdAt'>): Promise<Property>;
  findAll(): Promise<Property[]>;
  findById(id: string): Promise<Property | null>;
  update(id: string, data: Partial<Omit<Property, 'id' | 'createdAt'>>): Promise<Property>;
  delete(id: string): Promise<void>;
}
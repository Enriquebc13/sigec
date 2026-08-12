import { Image } from '../entities/image.entity';

export interface IImageRepository {
  create(data: Omit<Image, 'id' | 'createdAt'>): Promise<Image>;
  findByPropertyId(propertyId: string): Promise<Image[]>;
  findById(id: string): Promise<Image | null>;
  delete(id: string): Promise<void>;
}

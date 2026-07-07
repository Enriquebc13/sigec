import type { ImageEntity } from '../entities/image.entity';

export interface IImageRepository {
  create(url: string, propertyId: number): Promise<ImageEntity>;
  findById(id: number): Promise<ImageEntity | null>;
  findByPropertyId(propertyId: number): Promise<ImageEntity[]>;
  delete(id: number): Promise<void>;
}

export const IMAGE_REPOSITORY = 'IMAGE_REPOSITORY';

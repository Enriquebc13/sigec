import { Inject, Injectable } from '@nestjs/common';
import type { IImageRepository } from '../../domain/interfaces/image.repository.interface';
import type { Image } from '../../domain/entities/image.entity';

@Injectable()
export class GetImagesByPropertyUseCase {
  constructor(
    @Inject('IImageRepository')
    private readonly imageRepository: IImageRepository,
  ) {}

  async execute(propertyId: string): Promise<Image[]> {
    return this.imageRepository.findByPropertyId(propertyId);
  }
}

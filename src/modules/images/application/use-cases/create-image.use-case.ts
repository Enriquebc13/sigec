import { Inject, Injectable } from '@nestjs/common';

import type { IImageRepository } from '../../domain/interfaces/image.repository.interface';
import type { Image } from '../../domain/entities/image.entity';
import { CloudinaryService } from '../../../../shared/cloudinary/cloudinary.service';

@Injectable()
export class CreateImageUseCase {
  constructor(
    @Inject('IImageRepository')
    private readonly imageRepository: IImageRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(file: Express.Multer.File, propertyId: string): Promise<Image> {
    const url = await this.cloudinaryService.uploadFile(file, 'properties');

    return this.imageRepository.create({
      url,
      propertyId,
      updatedAt: null,
    });
  }
}

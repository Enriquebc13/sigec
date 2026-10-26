import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IImageRepository } from '../../domain/interfaces/image.repository.interface';
import type { Image } from '../../domain/entities/image.entity';
import { CloudinaryService } from '../../../../shared/cloudinary/cloudinary.service';
import type { IPropertyRepository } from 'src/modules/property/domain/interfaces/property.repository.interface';

@Injectable()
export class CreateImageUseCase {
  constructor(
    @Inject('IImageRepository')
    private readonly imageRepository: IImageRepository,
    @Inject('IPropertyRepository')
    private readonly propertyRepository: IPropertyRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async execute(file: Express.Multer.File, propertyId: string): Promise<Image> {
    const property = await this.propertyRepository.findById(propertyId);
    if (!property) throw new NotFoundException(`Propiedad con id ${propertyId} no encontrada`);

    const url = await this.cloudinaryService.uploadFile(file, 'properties');

    return this.imageRepository.create({
      url,
      propertyId,
      updatedAt: null,
    });
  }
}

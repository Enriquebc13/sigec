import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IImageRepository } from '../../domain/interfaces/image.repository.interface';
import { CloudinaryService } from '../../../../shared/cloudinary/cloudinary.service';

@Injectable()
export class DeleteImageUseCase {
  constructor(
    @Inject('IImageRepository')
    private readonly imageRepository: IImageRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(id: string): Promise<void> {
    const image = await this.imageRepository.findById(id);
    if (!image) throw new NotFoundException(`Imagen con id ${id} no encontrada`);
    await this.cloudinaryService.deleteFile(image.url);
    await this.imageRepository.delete(id);
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IImageRepository } from '../../domain/interfaces/image.repository.interface';
import type { Image } from '../../domain/entities/image.entity';

@Injectable()
export class GetImageUseCase {
  constructor(
    @Inject('IImageRepository')
    private readonly imageRepository: IImageRepository,
  ) {}

  async execute(id: string): Promise<Image> {
    const image = await this.imageRepository.findById(id);
    if (!image) throw new NotFoundException(`Imagen con id ${id} no encontrada`);
    return image;
  }
}

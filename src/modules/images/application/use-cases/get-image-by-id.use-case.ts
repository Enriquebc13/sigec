import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMAGE_REPOSITORY,
  IImageRepository,
} from '../../domain/interfaces/image.repository.interface';

@Injectable()
export class GetImageByIdUseCase {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: IImageRepository,
  ) {}

  async execute(id: number) {
    const image = await this.imageRepository.findById(id);
    if (!image) {
      throw new NotFoundException(`Imagen con id ${id} no encontrada`);
    }
    return image;
  }
}

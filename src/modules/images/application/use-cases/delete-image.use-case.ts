import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMAGE_REPOSITORY,
  IImageRepository,
} from '../../domain/interfaces/image.repository.interface';
import { FirebaseService } from '../../../../shared/firebase/firebase.service';

@Injectable()
export class DeleteImageUseCase {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: IImageRepository,
    private readonly firebaseService: FirebaseService,
  ) {}

  async execute(id: number) {
    const existing = await this.imageRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Imagen con id ${id} no encontrada`);
    }
    await this.firebaseService.deleteFile(existing.url);
    await this.imageRepository.delete(id);
    return { message: 'Imagen eliminada correctamente' };
  }
}

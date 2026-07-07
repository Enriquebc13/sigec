import { Inject, Injectable } from '@nestjs/common';
import {
  IMAGE_REPOSITORY,
  IImageRepository,
} from '../../domain/interfaces/image.repository.interface';
import { FirebaseService } from '../../../../shared/firebase/firebase.service';

@Injectable()
export class CreateImageUseCase {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: IImageRepository,
    private readonly firebaseService: FirebaseService,
  ) {}

  async execute(file: Express.Multer.File, propertyId: number) {
    const url = await this.firebaseService.uploadFile(file, 'properties');
    return this.imageRepository.create(url, propertyId);
  }
}

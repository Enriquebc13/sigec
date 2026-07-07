import { Inject, Injectable } from '@nestjs/common';
import  {
  IMAGE_REPOSITORY,
  IImageRepository,
} from '../../domain/interfaces/image.repository.interface';

@Injectable()
export class GetImagesByPropertyUseCase {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: IImageRepository,
  ) {}

  async execute(propertyId: number) {
    return this.imageRepository.findByPropertyId(propertyId);
  }
}

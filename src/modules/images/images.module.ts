import { Module } from '@nestjs/common';
import { FirebaseModule } from '../../shared/firebase/firebase.module';
import { PrismaService } from '../../prisma.service';
import { ImagesController } from './infrastructure/controllers/images.controller';
import { IMAGE_REPOSITORY } from './domain/interfaces/image.repository.interface';
import { PrismaImageRepository } from './infrastructure/repositories/prisma-image.repository';
import { CreateImageUseCase } from './application/use-cases/create-image.use-case';
import { GetImagesByPropertyUseCase } from './application/use-cases/get-images-by-property.use-case';
import { GetImageByIdUseCase } from './application/use-cases/get-image-by-id.use-case';
import { DeleteImageUseCase } from './application/use-cases/delete-image.use-case';

@Module({
  imports: [FirebaseModule],
  controllers: [ImagesController],
  providers: [
    PrismaService,
    { provide: IMAGE_REPOSITORY, useClass: PrismaImageRepository },
    CreateImageUseCase,
    GetImagesByPropertyUseCase,
    GetImageByIdUseCase,
    DeleteImageUseCase,
  ],
  exports: [IMAGE_REPOSITORY],
})
export class ImagesModule {}

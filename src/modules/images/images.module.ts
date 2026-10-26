import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary.module';
import { CloudinaryService } from '../../shared/cloudinary/cloudinary.service';
import { ImagesController } from './infrastructure/controllers/images.controller';
import { PrismaImageRepository } from './infrastructure/repositories/prisma-image.repository';
import { CreateImageUseCase } from './application/use-cases/create-image.use-case';
import { GetImagesByPropertyUseCase } from './application/use-cases/get-images-by-property.use-case';
import { GetImageUseCase } from './application/use-cases/get-image-by-id.use-case';
import { DeleteImageUseCase } from './application/use-cases/delete-image.use-case';
import type { IPropertyRepository } from '../property/domain/interfaces/property.repository.interface';
import { PropertyModule } from '../property/property.module';

@Module({
  imports: [CloudinaryModule, PropertyModule],
  controllers: [ImagesController],
  providers: [
    PrismaService,
    {
      provide: 'IImageRepository',
      useClass: PrismaImageRepository,
    },
    {
      provide: CreateImageUseCase,
      useFactory: (imageRepo: PrismaImageRepository, propertyRepo: IPropertyRepository,cloudinaryService: CloudinaryService) =>
        new CreateImageUseCase(imageRepo, propertyRepo, cloudinaryService),
      inject: ['IImageRepository', 'IPropertyRepository', CloudinaryService],
    },
    {
      provide: GetImagesByPropertyUseCase,
      useFactory: (imageRepo: PrismaImageRepository) => new GetImagesByPropertyUseCase(imageRepo),
      inject: ['IImageRepository'],
    },
    {
      provide: GetImageUseCase,
      useFactory: (imageRepo: PrismaImageRepository) => new GetImageUseCase(imageRepo),
      inject: ['IImageRepository'],
    },
    {
      provide: DeleteImageUseCase,
      useFactory: (imageRepo: PrismaImageRepository, cloudinaryService: CloudinaryService) =>
        new DeleteImageUseCase(imageRepo, cloudinaryService),
      inject: ['IImageRepository', CloudinaryService],
    },
  ],
})
export class ImagesModule {}

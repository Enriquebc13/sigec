import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { PropertyController } from './infrastructure/controllers/property.controller';
import { PrismaPropertyRepository } from './infrastructure/repositories/prisma-property.repository';
import { CreatePropertyUseCase } from './application/use-cases/create-property.use-case';
import { GetAllPropertiesUseCase } from './application/use-cases/get-all-properties.use-case';
import { GetPropertyUseCase } from './application/use-cases/get-property.use-case';
import { UpdatePropertyUseCase } from './application/use-cases/update-property.use-case';
import { DeletePropertyUseCase } from './application/use-cases/delete-property.use-case';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [PropertyController],
  providers: [
    PrismaService,
    {
      provide: 'IPropertyRepository',
      useClass: PrismaPropertyRepository,
    },
    {
      provide: CreatePropertyUseCase,
      useFactory: (propertyRepo: PrismaPropertyRepository) => new CreatePropertyUseCase(propertyRepo),
      inject: ['IPropertyRepository'],
    },
    {
      provide: GetAllPropertiesUseCase,
      useFactory: (propertyRepo: PrismaPropertyRepository) => new GetAllPropertiesUseCase(propertyRepo),
      inject: ['IPropertyRepository'],
    },
    {
      provide: GetPropertyUseCase,
      useFactory: (propertyRepo: PrismaPropertyRepository) => new GetPropertyUseCase(propertyRepo),
      inject: ['IPropertyRepository'],
    },
    {
      provide: UpdatePropertyUseCase,
      useFactory: (propertyRepo: PrismaPropertyRepository) => new UpdatePropertyUseCase(propertyRepo),
      inject: ['IPropertyRepository'],
    },
    {
      provide: DeletePropertyUseCase,
      useFactory: (propertyRepo: PrismaPropertyRepository, cloudinaryService: CloudinaryService) => new DeletePropertyUseCase(propertyRepo, cloudinaryService),
      inject: ['IPropertyRepository', CloudinaryService],
    },
  ],
})
export class PropertyModule { }
import {Body,Controller,Delete,Get,HttpCode,HttpStatus,Param,Post,UploadedFile,UseGuards,UseInterceptors,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageUseCase } from '../../application/use-cases/create-image.use-case';
import { GetImagesByPropertyUseCase } from '../../application/use-cases/get-images-by-property.use-case';
import { GetImageUseCase } from '../../application/use-cases/get-image-by-id.use-case';
import { DeleteImageUseCase } from '../../application/use-cases/delete-image.use-case';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import type { Express } from 'express';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly createImageUseCase: CreateImageUseCase,
    private readonly getImagesByPropertyUseCase: GetImagesByPropertyUseCase,
    private readonly getImageUseCase: GetImageUseCase,
    private readonly deleteImageUseCase: DeleteImageUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body('propertyId') propertyId: string,
  ) {
    return this.createImageUseCase.execute(file, propertyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('property/:propertyId')
  @HttpCode(HttpStatus.OK)
  findByProperty(@Param('propertyId') propertyId: string) {
    return this.getImagesByPropertyUseCase.execute(propertyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.getImageUseCase.execute(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.deleteImageUseCase.execute(id);
    return { message: 'Imagen eliminada correctamente' };
  }

}

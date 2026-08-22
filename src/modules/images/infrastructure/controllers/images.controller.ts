import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse, } from '@nestjs/swagger';
import { CreateImageUseCase } from '../../application/use-cases/create-image.use-case';
import { GetImagesByPropertyUseCase } from '../../application/use-cases/get-images-by-property.use-case';
import { DeleteImageUseCase } from '../../application/use-cases/delete-image.use-case';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { Image } from '../../domain/entities/image.entity';
import { GetImageUseCase } from '../../application/use-cases/get-image-by-id.use-case';

@ApiBearerAuth()
@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(
    private readonly createImageUseCase: CreateImageUseCase,
    private readonly getImagesByPropertyUseCase: GetImagesByPropertyUseCase,
    private readonly getImageUseCase: GetImageUseCase,
    private readonly deleteImageUseCase: DeleteImageUseCase,
  ) {}

  @ApiOperation({ summary: 'Subir imagen de la propiedad' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo de imagen y el id de la propiedad a la que pertenece',
    schema: {
      type: 'object',
      required: ['file', 'propertyId'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen a subir',
        },
        propertyId: {
          type: 'string',
          description: 'Id de la propiedad a la que pertenece la imagen',
        },
      },
    },
  })
  @ApiOkResponse({ type: Image, description: 'Imagen subida y registrada correctamente' })
  @ApiUnauthorizedResponse({ description: 'No se envió un token JWT válido' })
  @ApiForbiddenResponse({ description: 'El usuario no tiene el rol ADMIN' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Body('propertyId') propertyId: string) {
    return this.createImageUseCase.execute(file, propertyId);
  }

  @ApiOperation({ summary: 'Listar las imágenes asociadas a una propiedad' })
  @ApiParam({ name: 'propertyId', description: 'Id de la propiedad'})
  @ApiOkResponse({ type: Image, isArray: true, description: 'Lista de imágenes de la propiedad' })
  @ApiUnauthorizedResponse({ description: 'No se envió un token JWT válido' })
  @UseGuards(JwtAuthGuard)
  @Get('property/:propertyId')
  @HttpCode(HttpStatus.OK)
  findByProperty(@Param('propertyId') propertyId: string) {
    return this.getImagesByPropertyUseCase.execute(propertyId);
  }

  @ApiOperation({ summary: 'Obtener una imagen por su id' })
  @ApiParam({ name: 'id', description: 'Id de la imagen'})
  @ApiOkResponse({ type: Image, description: 'Imagen encontrada' })
  @ApiUnauthorizedResponse({ description: 'No se envió un token JWT válido' })
  @ApiNotFoundResponse({ description: 'No existe una imagen con ese id' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.getImageUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Eliminar una imagen (Cloudinary + base de datos)' })
  @ApiParam({ name: 'id', description: 'Id de la imagen'})
  @ApiOkResponse({
    description: 'Imagen eliminada correctamente',
    schema: { example: { message: 'Imagen eliminada correctamente' } },
  })
  @ApiUnauthorizedResponse({ description: 'No se envió un token JWT válido' })
  @ApiForbiddenResponse({ description: 'El usuario autenticado no tiene el rol ADMIN' })
  @ApiNotFoundResponse({ description: 'No existe una imagen con ese id' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.deleteImageUseCase.execute(id);
    return { message: 'Imagen eliminada correctamente' };
  }
}

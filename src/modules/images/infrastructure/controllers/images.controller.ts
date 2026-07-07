import { Controller,Post,Get,Delete,Param,Body,UploadedFile,UseInterceptors,ParseIntPipe,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageUseCase } from '../../application/use-cases/create-image.use-case';
import { GetImagesByPropertyUseCase } from '../../application/use-cases/get-images-by-property.use-case';
import { GetImageByIdUseCase } from '../../application/use-cases/get-image-by-id.use-case';
import { DeleteImageUseCase } from '../../application/use-cases/delete-image.use-case';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly createImageUseCase: CreateImageUseCase,
    private readonly getImagesByPropertyUseCase: GetImagesByPropertyUseCase,
    private readonly getImageByIdUseCase: GetImageByIdUseCase,
    private readonly deleteImageUseCase: DeleteImageUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body('propertyId', ParseIntPipe) propertyId: number,
  ) {
    return this.createImageUseCase.execute(file, propertyId);
  }

  @Get('property/:propertyId')
  findByProperty(@Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.getImagesByPropertyUseCase.execute(propertyId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getImageByIdUseCase.execute(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteImageUseCase.execute(id);
  }
}

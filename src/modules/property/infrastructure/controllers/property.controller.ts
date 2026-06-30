import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreatePropertyUseCase } from '../../application/use-cases/create-property.use-case';
import { CreatePropertyDto } from '../../application/dtos/create-property.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { GetAllPropertiesUseCase } from '../../application/use-cases/get-all-properties.use-case';
import { GetPropertyUseCase } from '../../application/use-cases/get-property.use-case';
import { UpdatePropertyDto } from '../../application/dtos/update-property.dto';
import { UpdatePropertyUseCase } from '../../application/use-cases/update-property.use-case';

@Controller('properties')
export class PropertyController {
  constructor(
    private readonly createPropertyUseCase: CreatePropertyUseCase,
    private readonly getAllPropertiesUseCase: GetAllPropertiesUseCase,
    private readonly getPropertyUseCase: GetPropertyUseCase,
    private readonly updatePropertyUseCase: UpdatePropertyUseCase,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePropertyDto) {
    return this.createPropertyUseCase.execute(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.getAllPropertiesUseCase.execute()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getPropertyUseCase.execute(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePropertyDto) {
    return this.updatePropertyUseCase.execute(id, dto);
  }
}
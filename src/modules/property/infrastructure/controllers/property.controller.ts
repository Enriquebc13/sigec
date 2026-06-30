import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreatePropertyUseCase } from '../../application/use-cases/create-property.use-case';
import { CreatePropertyDto } from '../../application/dtos/create-property.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { GetAllPropertiesUseCase } from '../../application/use-cases/get-all-properties.use-case';

@Controller('properties')
export class PropertyController {
  constructor(private readonly createPropertyUseCase: CreatePropertyUseCase,
    private readonly getAllPropertiesUseCase: GetAllPropertiesUseCase,
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
}
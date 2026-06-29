import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreatePropertyUseCase } from '../../application/use-cases/create-property.use-case';
import { CreatePropertyDto } from '../../application/dtos/create-property.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';

@Controller('properties')
export class PropertyController {
  constructor(private readonly createPropertyUseCase: CreatePropertyUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePropertyDto) {
    return this.createPropertyUseCase.execute(dto);
  }
}
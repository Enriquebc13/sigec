import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreatePropertyUseCase } from '../../application/use-cases/create-property.use-case';
import { CreatePropertyDto } from '../../application/dtos/create-property.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { GetAllPropertiesUseCase } from '../../application/use-cases/get-all-properties.use-case';
import { GetPropertyUseCase } from '../../application/use-cases/get-property.use-case';
import { UpdatePropertyDto } from '../../application/dtos/update-property.dto';
import { UpdatePropertyUseCase } from '../../application/use-cases/update-property.use-case';
import { DeletePropertyUseCase } from '../../application/use-cases/delete-property.use-case';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Property } from '../../domain/entities/property.entity';

@ApiBearerAuth() //Todo el controlador requiere jwt
@ApiTags("Propiedades")//Nombre del grupo de endpoints
//Si se coloca el mismo tag a varios controllers se agruparan los endpoints  de todos los controllers
//(un solo grupo/modulo)
@Controller('properties')
export class PropertyController {
  constructor(
    private readonly createPropertyUseCase: CreatePropertyUseCase,
    private readonly getAllPropertiesUseCase: GetAllPropertiesUseCase,
    private readonly getPropertyUseCase: GetPropertyUseCase,
    private readonly updatePropertyUseCase: UpdatePropertyUseCase,
    private readonly deletePropertyUseCase: DeletePropertyUseCase,
  ) { }

  @ApiOperation({ summary: "Registrar una Propiedad" })
  @ApiCreatedResponse({ type: Property })//el tipo que retorna
  @ApiBody({
    description: "Datos de la propiedad",
    type: CreatePropertyDto
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  //@HttpCode(HttpStatus.OK)
  create(@Body() dto: CreatePropertyDto) {
    return this.createPropertyUseCase.execute(dto);
  }


  @ApiOperation({ summary: "Obtener todas las propiedades" })
  @ApiResponse({ status: 200, type: Property, isArray: true })
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.getAllPropertiesUseCase.execute()
  }

  @ApiOperation({ summary: "Obtener una Propiedad por id" })
  @ApiParam({
    type: "string",
    name: "id",
    description: "Id de propiedad"
  })
  @ApiResponse({ status: 200, type: Property })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.getPropertyUseCase.execute(id);
  }

  @ApiOperation({ summary: "Actualizar una Propiedad" })
  @ApiParam({
    type: "string",
    name: "id",
    description: "Id de propiedad"
  })
  @ApiBody({
    description: "Datos de la propiedad",
    type: UpdatePropertyDto
  })
  @ApiResponse({ status: 200, type: Property })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() dto: UpdatePropertyDto) {
    return this.updatePropertyUseCase.execute(id, dto);
  }

  @ApiOperation({ summary: "Eliminar una Propiedad" })
  @ApiParam({
    type: "string",
    name: "id",
    description: "Id de propiedad"
  })
  @ApiResponse({
    status: 200,
    description: "Propiedad eliminada correctamente"
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.deletePropertyUseCase.execute(id);
    return { message: 'Propiedad eliminada correctamente' };
  }
}
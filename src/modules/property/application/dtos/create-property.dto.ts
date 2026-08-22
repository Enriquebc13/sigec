import { IsString, IsNumber, IsOptional, IsEnum, Min, IsInt, ValidateNested } from 'class-validator';
import { PropertyType } from 'generated/prisma/enums';
import { AddressDto } from './address.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({ required: true, description: "Título de la propiedad" })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  title: string;

  @ApiProperty({ required: false, description: "Descripción de la propiedad" })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: true, description: "Precio de la propiedad" })
  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @Min(0, { message: "El precio debe ser mayor o igual a 0" })
  price: number;

  @ApiProperty({ required: false, description: "Costo de mantenimiento de la propiedad" })
  @IsNumber({}, { message: 'El costo de mantenimiento debe ser un número.' })
  @Min(0)
  @IsOptional()
  maintenanceCost?: number;

  @ApiProperty({ required: false, description: "Dimensiones de la propiedad" })
  @IsString({ message: 'La dimensión debe ser una cadena de texto.' })
  @IsOptional()
  dimensions?: string;

  @ApiProperty({ required: false, description: "Piso en el que se encuentra la propiedad" })
  @IsInt({ message: 'El piso debe ser un número entero.' })
  @IsOptional()
  floor?: number;

  @ApiProperty({ required: true, enum: PropertyType, description: "Tipo de propiedad" })
  @IsEnum(PropertyType, {
    message: 'El tipo de propiedad no es válido.',
  })
  type: PropertyType;

  @ApiProperty({ required: false, description: "Amenidades con las que cuenta la propiedad" })
  @IsString({ message: 'Las amenidades deben ser una cadena de texto.' })
  @IsOptional()
  amenities?: string;

  @ApiProperty({ required: true, type: () => AddressDto, description: "Dirección de la propiedad" })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({ required: true, description: "ID del usuario" })
  @IsString()
  userId: string;
}
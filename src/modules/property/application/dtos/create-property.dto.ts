import { IsString, IsNumber, IsOptional, IsEnum, Min, IsInt, ValidateNested } from 'class-validator';
import { PropertyType } from 'generated/prisma/enums';
import { AddressDto } from './address.dto';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  title: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @Min(0, { message: "El precio debe ser mayor o igual a 0" })
  price: number;

  @IsNumber({}, { message: 'El costo de mantenimiento debe ser un número.' })
  @Min(0)
  @IsOptional()
  maintenanceCost?: number;

  @IsString({ message: 'La dimensión debe ser una cadena de texto.' })
  @IsOptional()
  dimensions?: string;

  @IsInt({ message: 'El piso debe ser un número entero.' })
  @IsOptional()
  floor?: number;

  @IsEnum(PropertyType, {
    message: 'El tipo de propiedad no es válido.',
  })
  type: PropertyType;

  @IsString({ message: 'Las amenidades deben ser una cadena de texto.' })
  @IsOptional()
  amenities?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsString()
  userId: string;
}
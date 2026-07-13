import { IsString, IsNumber, IsOptional, IsEnum, Min, IsInt, ValidateNested } from 'class-validator';
import { PropertyType, PropertyStatus } from 'generated/prisma/enums';
import { Type } from 'class-transformer';
import { UpdateAddressDto } from './update-address.dto';

export class UpdatePropertyDto {
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @IsOptional()
  @Min(0, { message: "El precio debe ser mayor o igual a 0" })
  price?: number;

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

  @IsEnum(PropertyType, { message: 'El tipo de propiedad no es válido.', })
  @IsOptional()
  type?: PropertyType;

  @IsEnum(PropertyStatus, { message: 'El status de la propiedad no es válido.', })
  @IsOptional()
  status?: PropertyStatus;

  @IsString({ message: 'Las amenidades deben ser una cadena de texto.' })
  @IsOptional()
  amenities?: string;

  @ValidateNested()
  @Type(() => UpdateAddressDto)
  @IsOptional()
  address?: UpdateAddressDto;
}
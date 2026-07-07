import { IsString, IsNumber, IsOptional, IsEnum, Min, IsInt } from 'class-validator';
import { PropertyType, PropertyStatus } from 'generated/prisma/enums';

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

  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @IsOptional()
  address?: string;

  @IsString({ message: 'La ciudad debe ser una cadena de texto.' })
  @IsOptional()
  city?: string;

  @IsString({ message: 'El estado debe ser una cadena de texto.' })
  @IsOptional()
  state?: string;

  @IsString({ message: 'El código postal debe ser una cadena de texto.' })
  @IsOptional()
  zipCode?: string;

  @IsString({ message: 'Las amenidades deben ser una cadena de texto.' })
  @IsOptional()
  amenities?: string;
}
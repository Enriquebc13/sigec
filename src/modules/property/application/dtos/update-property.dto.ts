import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
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

  @IsString({ message: 'La dimensión debe ser una cadena de texto.' })
  @IsOptional()
  dimensions?: string;

  @IsEnum(PropertyType, {message: 'El tipo de propiedad no es válido.',})
  @IsOptional()
  type?: PropertyType;

  @IsEnum(PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;
}
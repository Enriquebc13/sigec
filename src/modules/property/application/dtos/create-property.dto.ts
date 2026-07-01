import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { PropertyType } from 'generated/prisma/enums';


export class CreatePropertyDto {
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  title: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @Min(0, { message: "El precio debe ser mayor o igual a 0" })
  price: number;

  @IsString({ message: 'La dimensión debe ser una cadena de texto.' })
  @IsOptional()
  dimensions?: string;

  @IsEnum(PropertyType, {
    message: 'El tipo de propiedad no es válido.',})
  type: PropertyType;

  @IsString()
  userId: string;
}
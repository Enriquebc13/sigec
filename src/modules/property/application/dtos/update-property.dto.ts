import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { PropertyType, PropertyStatus } from 'generated/prisma/enums';

export class UpdatePropertyDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsString()
  @IsOptional()
  dimensions?: string;

  @IsEnum(PropertyType)
  @IsOptional()
  type?: PropertyType;

  @IsEnum(PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;
}
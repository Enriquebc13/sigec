import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { PropertyType } from 'generated/prisma/enums';


export class CreatePropertyDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  dimensions?: string;

  @IsEnum(PropertyType)
  type: PropertyType;

  @IsString()
  userId: string;
}
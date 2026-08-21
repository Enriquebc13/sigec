import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({ required: false, description: "Calle de la propiedad" })
  @IsString({ message: 'La calle debe ser una cadena de texto.' })
  @IsOptional()
  street?: string;

  @ApiProperty({ required: false, description: "Ciudad de la propiedad" })
  @IsString({ message: 'La ciudad debe ser una cadena de texto.' })
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false, description: "Estado de la propiedad" })
  @IsString({ message: 'El estado debe ser una cadena de texto.' })
  @IsOptional()
  state?: string;

  @ApiProperty({ required: false, description: "Código postal de la propiedad" })
  @IsString({ message: 'El código postal debe ser una cadena de texto.' })
  @IsOptional()
  zipCode?: string;
}
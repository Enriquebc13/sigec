import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty({ required: true, description: "Calle de la propiedad" })
  @IsString({ message: 'La calle debe ser una cadena de texto.' })
  street: string;

  @ApiProperty({ required: true, description: "Ciudad de la propiedad" })
  @IsString({ message: 'La ciudad debe ser una cadena de texto.' })
  city: string;

  @ApiProperty({ required: true, description: "Estado de la propiedad" })
  @IsString({ message: 'El estado debe ser una cadena de texto.' })
  state: string;

  @ApiProperty({ required: true, description: "Código postal de la propiedad" })
  @IsString({ message: 'El código postal debe ser una cadena de texto.' })
  zipCode: string;
}
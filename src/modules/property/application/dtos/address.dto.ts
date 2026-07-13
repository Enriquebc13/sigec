import { IsString } from 'class-validator';

export class AddressDto {
  @IsString({ message: 'La calle debe ser una cadena de texto.' })
  street: string;

  @IsString({ message: 'La ciudad debe ser una cadena de texto.' })
  city: string;

  @IsString({ message: 'El estado debe ser una cadena de texto.' })
  state: string;

  @IsString({ message: 'El código postal debe ser una cadena de texto.' })
  zipCode: string;
}
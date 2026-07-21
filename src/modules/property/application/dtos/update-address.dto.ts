import { IsString, IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @IsString({ message: 'La calle debe ser una cadena de texto.' })
  @IsOptional()
  street?: string;

  @IsString({ message: 'La ciudad debe ser una cadena de texto.' })
  @IsOptional()
  city?: string;

  @IsString({ message: 'El estado debe ser una cadena de texto.' })
  @IsOptional()
  state?: string;

  @IsString({ message: 'El código postal debe ser una cadena de texto.' })
  @IsOptional()
  zipCode?: string;
}
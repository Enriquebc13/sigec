import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  propertyId: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRequestPhoneDto {
  @ApiProperty({ required: true, description: 'Nuevo teléfono de contacto' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  telefono: string;
}

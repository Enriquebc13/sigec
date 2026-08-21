import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRequestDto {

  @ApiProperty({required: true, description: "El numero de telefono es obligatorio"})

  // Número de teléfono de contacto del solicitante (obligatorio)
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  telefono: string;

  // ID de la propiedad sobre la que se envía la solicitud (obligatorio)
  @ApiProperty({required: true, description: "Ingresa una propiedad"})
  @IsString({ message: 'El ID de la propiedad debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID de la propiedad es obligatorio' })
  propertyId: string;
}
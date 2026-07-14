import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateRequestDto {
  
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString({ message: 'Los apellidos deben ser una cadena de texto' })
  @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
  apellidos: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  telefono: string;

  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @IsString({ message: 'El ID de la propiedad debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID de la propiedad es obligatorio' })
  propertyId: string;
}
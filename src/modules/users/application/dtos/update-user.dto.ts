import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Por favor ingresa un nombre válido' })
  @IsString({ message: 'Por favor ingresa un nombre válido' })
  name?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Por favor ingresa un apellido válido' })
  @IsString({ message: 'Por favor ingresa un apellido válido' })
  lastname?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo ingresado no es válido' })
  email?: string;
}
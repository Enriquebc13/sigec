import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre no es válido.' })
  name: string;

  @IsNotEmpty({ message: 'El  es obligatorio.' })
  @IsString ({ message: 'El apellido no es válido.'})
  lastname: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @IsString({message: 'La contraseña no es válida.'})
  @MinLength(8,
    {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  }
  )
  password: string;
  
  @IsNotEmpty({ message: 'El rol es obligatorio.' })
  @IsIn(['ADMIN', 'CLIENT'], {
    message: 'El rol debe ser ADMIN o CLIENT.',
  })
  role: 'ADMIN' | 'CLIENT';
}
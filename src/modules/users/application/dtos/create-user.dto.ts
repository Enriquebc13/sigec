import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {

  @ApiProperty({ required: true, description:'Email del usuario'})
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email: string;

  @ApiProperty({ required: true, description:'Nombre del usuario'})
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre no es válido.' })
  name: string;

  @ApiProperty({ required: true, description:'Apellido del usuario'})
  @IsNotEmpty({ message: 'El  apellido es obligatorio.' })
  @IsString ({ message: 'El apellido no es válido.'})
  lastname: string;

  @ApiProperty({ required: true, description:'Contaseña del usuario'})
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @IsString({message: 'La contraseña no es válida.'})
  @MinLength(8,
    {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  }
  )
  password: string;

  @ApiProperty({ required: true, description:'Rol del usuario'})
  @IsNotEmpty({ message: 'El rol es obligatorio.' })
  @IsIn(['ADMIN', 'CLIENT'], {
    message: 'El rol debe ser ADMIN o CLIENT.',
  })
  role: 'ADMIN' | 'CLIENT';
}
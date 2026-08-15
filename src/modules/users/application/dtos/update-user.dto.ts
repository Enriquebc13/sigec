import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {

  @ApiProperty({description: 'Nombre del usuario' })
  @IsOptional()
  @IsNotEmpty({ message: 'Por favor ingresa un nombre válido' })
  @IsString({ message: 'Por favor ingresa un nombre válido' })
  name?: string;

  @ApiProperty({description: 'Apellido del usuario' })
  @IsOptional()
  @IsNotEmpty({ message: 'Por favor ingresa un apellido válido' })
  @IsString({ message: 'Por favor ingresa un apellido válido' })
  lastname?: string;

  @ApiProperty({description: 'Email del usuario' })
  @IsOptional()
  @IsEmail({}, { message: 'El correo ingresado no es válido' })
  email?: string;
}
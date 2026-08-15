import { ApiProperty } from '@nestjs/swagger';

// Se definen qué datos debe tener un objeto User
export class User {
  @ApiProperty({
    description: 'Identificador único del usuario',
  })
  public readonly id: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
  })
  public readonly email: string;

  @ApiProperty({
    description: 'Nombre del usuario',
  })
  public readonly name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
  })
  public readonly lastname: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
  })
  public readonly password: string;

  @ApiProperty({
    description: 'Rol del usuario',
  })
  public readonly role: 'ADMIN' | 'CLIENT';

  @ApiProperty({
    description: 'Indica si el usuario está activo',
  })
  public readonly active: boolean;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
  })
  public readonly createdAt: Date;

  @ApiProperty({
    description: 'Fecha de actualización del usuario',
  })
  public readonly updatedAt: Date;

  constructor(
    id: string,
    email: string,
    name: string,
    lastname: string,
    password: string,
    role: 'ADMIN' | 'CLIENT',
    active: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.lastname = lastname;
    this.password = password;
    this.role = role;
    this.active = active;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
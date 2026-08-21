import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from 'generated/prisma/enums';

// Se definen qué datos debe tener un objeto Request
export class RequestEntity {
  @ApiProperty({
    description: 'Identificador único de la solicitud',
  })
  public readonly id: string;

  @ApiProperty({
    description: 'Teléfono de contacto del solicitante',
  })
  public readonly telefono: string;

  @ApiProperty({
    description: 'ID del usuario que generó la solicitud',
  })
  public readonly userId: string;

  @ApiProperty({
    description: 'ID de la propiedad/espacio solicitado',
  })
  public readonly propertyId: string;

  @ApiProperty({
    description: 'Estado actual de la solicitud',
    enum: RequestStatus,
  })
  public readonly status: RequestStatus;

  @ApiProperty({
    description: 'Fecha de creación de la solicitud',
  })
  public readonly createdAt: Date;

  constructor(
    id: string,
    telefono: string,
    userId: string,
    propertyId: string,
    status: RequestStatus,
    createdAt: Date,
  ) {
    this.id = id;
    this.telefono = telefono;
    this.userId = userId;
    this.propertyId = propertyId;
    this.status = status;
    this.createdAt = createdAt;
  }
}
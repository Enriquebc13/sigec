import { ApiProperty } from '@nestjs/swagger';

export class Image {
  @ApiProperty({ description: 'Id único de la imagen ', example: 'clz1a2b3c4d5e6f7g8h9i0j' })
  id: string;

  @ApiProperty({
    description: 'URL pública de la imagen alojada en Cloudinary',
    example: 'https://res.cloudinary.com/demo/image/upload/v123/properties/mercedes.jpg',
  })
  url: string;

  @ApiProperty({ description: 'Id de la propiedad a la que pertenece la imagen', example: 'cmrd57a7y0000q4tv3z2etwkl' })
  propertyId: string;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de la última actualización', nullable: true })
  updatedAt: Date | null;

  constructor(
    id: string,
    url: string,
    propertyId: string,
    createdAt: Date,
    updatedAt: Date | null,
  ) {
    this.id = id;
    this.url = url;
    this.propertyId = propertyId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

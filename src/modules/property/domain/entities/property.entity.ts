import { PropertyStatus, PropertyType } from "generated/prisma/enums";
import { Address } from "./address.entity";
import { ApiProperty } from "@nestjs/swagger";


export class Property {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty({ required: true, description: "Titulo de la propiedad" })
  public readonly title: string;

  @ApiProperty({ required: false, nullable: true, type: String, description: "Descripción de la propiedad" })
  public readonly description: string | null;

  @ApiProperty({ required: true, description: "Precio de la propiedad" })
  public readonly price: number;

  @ApiProperty({ required: false, nullable: true, type: Number, description: "Costo de mantenimiento de la propiedad" })
  public readonly maintenanceCost: number | null;

  @ApiProperty({ required: false, nullable: true, type: String, description: "Dimensiones de la propiedad" })
  public readonly dimensions: string | null;

  @ApiProperty({ required: false, nullable: true, type: Number, description: "Piso en el que se encuentra la propiedad" })
  public readonly floor: number | null;

  @ApiProperty({ required: true, enum: PropertyType, description: "Tipo de propiedad" })
  public readonly type: PropertyType;

  @ApiProperty({ required: true, enum: PropertyStatus, description: "Status de la propiedad" })
  public readonly status: PropertyStatus;

  @ApiProperty({ required: false, nullable: true, type: String, description: "Amenidades de la propiedad" })
  public readonly amenities: string | null;

  @ApiProperty({ required: true, description: "ID de usuario" })
  public readonly userId: string;

  @ApiProperty({ required: true, description: "Fecha de creación de la propiedad" })
  public readonly createdAt: Date;

  @ApiProperty({ required: false, nullable: true, type: Date, description: "Actualización de la propiedad" })
  public readonly updatedAt: Date | null;

  @ApiProperty({ required: false, type: () => Address, description: "Dirección de la propiedad" })
  public readonly address?: Address;


  constructor(
    id: string,
    title: string,
    description: string | null,
    price: number,
    maintenanceCost: number | null,
    dimensions: string | null,
    floor: number | null,
    type: PropertyType,
    status: PropertyStatus,
    amenities: string | null,
    userId: string,
    createdAt: Date,
    updatedAt: Date | null,
    address?: Address,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.maintenanceCost = maintenanceCost;
    this.dimensions = dimensions;
    this.floor = floor;
    this.type = type;
    this.status = status;
    this.amenities = amenities;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.address = address;
  }

}
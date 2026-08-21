import { ApiProperty } from "@nestjs/swagger";

export class Address {

  @ApiProperty({ required: true, description: "ID de la dirección" })
  public readonly id: string;

  @ApiProperty({ required: true, description: "Calle de la propiedad" })
  public readonly street: string;

  @ApiProperty({ required: true, description: "Ciudad de la propiedad" })
  public readonly city: string;

  @ApiProperty({ required: true, description: "Estado de la propiedad" })
  public readonly state: string;

  @ApiProperty({ required: true, description: "Código postal de la propiedad" })
  public readonly zipCode: string;

  @ApiProperty({ required: true, description: "ID de la propiedad asociada" })
  public readonly propertyId: string;

  constructor(
    id: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    propertyId: string,
  ) {
    this.id = id;
    this.street = street;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.propertyId = propertyId;
  }
}
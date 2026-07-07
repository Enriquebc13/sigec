import { PropertyStatus, PropertyType } from "generated/prisma/enums";


export class Property {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly price: number,
    public readonly maintenanceCost: number | null,
    public readonly dimensions: string | null,
    public readonly floor: number | null,
    public readonly type: PropertyType,
    public readonly status: PropertyStatus,
    public readonly address: string,
    public readonly city: string,
    public readonly state: string,
    public readonly zipCode: string,
    public readonly amenities: string | null,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null,
  ) { }
}
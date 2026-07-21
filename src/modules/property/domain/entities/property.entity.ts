import { PropertyStatus, PropertyType } from "generated/prisma/enums";
import { Address } from "./address.entity";


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
    public readonly amenities: string | null,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null,
    public readonly address?: Address,
  ) { }
}
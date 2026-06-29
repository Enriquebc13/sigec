import { PropertyStatus, PropertyType } from "generated/prisma/enums";


export class Property {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly price: number,
    public readonly dimensions: string | null,
    public readonly type: PropertyType,
    public readonly status: PropertyStatus,
    public readonly userId: string,
    public readonly createdAt: Date,
  ) {}
}
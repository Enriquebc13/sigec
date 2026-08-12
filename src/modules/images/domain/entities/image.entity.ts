export class Image {
  constructor(
    public readonly id: string,
    public readonly url: string,
    public readonly propertyId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null,
  ) {}
}

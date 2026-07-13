import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import type { CreatePropertyData, IPropertyRepository, UpdatePropertyData } from '../../domain/interfaces/property.repository.interface';
import type { Property } from '../../domain/entities/property.entity';

@Injectable()
export class PrismaPropertyRepository implements IPropertyRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreatePropertyData): Promise<Property> {
    const property = await this.prisma.property.create({

      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        maintenanceCost: data.maintenanceCost,
        dimensions: data.dimensions,
        floor: data.floor,
        type: data.type as any,
        status: data.status as any,
        amenities: data.amenities,
        userId: data.userId,
        address: {
          create: {
            street: data.address.street,
            city: data.address.city,
            state: data.address.state,
            zipCode: data.address.zipCode,
          }
        }
      },
      include: { address: true }
    });
    return property as unknown as Property;
  }

  async findAll(): Promise<Property[]> {
    const properties = await this.prisma.property.findMany(
      {
        include: { address: true }
      });
    return properties as unknown as Property[];
  }

  async findById(id: string): Promise<Property | null> {
    const property = await this.prisma.property.findUnique({ where: { id }, include: { address: true } });
    return property ? property as unknown as Property : null;
  }

  async update(id: string, data: UpdatePropertyData): Promise<Property> {
    const property = await this.prisma.property.update({
      where: { id },
      data:
      {
        ...data,
        type: data.type as any,
        status: data.status as any,
        address: data.address ? {
          update: {
            street: data.address.street,
            city: data.address.city,
            state: data.address.state,
            zipCode: data.address.zipCode,
          }
        } : undefined,
      },
      include: { address: true }
    });
    return property as unknown as Property;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.property.delete({ where: { id } });
  }
}
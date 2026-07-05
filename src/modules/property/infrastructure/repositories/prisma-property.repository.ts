import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import type { IPropertyRepository } from '../../domain/interfaces/property.repository.interface';
import type { Property } from '../../domain/entities/property.entity';

@Injectable()
export class PrismaPropertyRepository implements IPropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<Property, 'id' | 'createdAt'>): Promise<Property> {
    const property = await this.prisma.property.create({ data });
    return property as unknown as Property;
  }

  async findAll(): Promise<Property[]> {
    const properties = await this.prisma.property.findMany();
    return properties as unknown as Property[];
  }

  async findById(id: string): Promise<Property | null> {
    const property = await this.prisma.property.findUnique({ where: { id } });
    return property ? property as unknown as Property : null;
  }

  async update(id: string, data: Partial<Omit<Property, 'id' | 'createdAt'>>): Promise<Property> {
    const property = await this.prisma.property.update({ where: { id }, data });
    return property as unknown as Property;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.property.delete({ where: { id } });
  }
}
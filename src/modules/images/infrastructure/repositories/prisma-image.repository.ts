import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import type { IImageRepository } from '../../domain/interfaces/image.repository.interface';
import type { Image } from '../../domain/entities/image.entity';

@Injectable()
export class PrismaImageRepository implements IImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<Image, 'id' | 'createdAt'>): Promise<Image> {
    const image = await this.prisma.image.create({ data });
    return image as unknown as Image;
  }

  async findByPropertyId(propertyId: string): Promise<Image[]> {
    const images = await this.prisma.image.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'asc' },
    });
    return images as unknown as Image[];
  }

  async findById(id: string): Promise<Image | null> {
    const image = await this.prisma.image.findUnique({ where: { id } });
    return image ? (image as unknown as Image) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.image.delete({ where: { id } });
  }
}

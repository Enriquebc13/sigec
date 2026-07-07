import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import type { IImageRepository } from '../../domain/interfaces/image.repository.interface';
import { ImageEntity } from '../../domain/entities/image.entity';

@Injectable()
export class PrismaImageRepository implements IImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(url: string, propertyId: string): Promise<ImageEntity> {
    const image = await this.prisma.image.create({
      data: { url, propertyId },
    });
    return this.toEntity(image);
  }

  async findById(id: string): Promise<ImageEntity | null> {
    const image = await this.prisma.image.findUnique({ where: { id } });
    return image ? this.toEntity(image) : null;
  }

  async findByPropertyId(propertyId: string): Promise<ImageEntity[]> {
    const images = await this.prisma.image.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'asc' },
    });
    return images.map(this.toEntity);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.image.delete({ where: { id } });
  }

  private toEntity(image: any): ImageEntity {
    return new ImageEntity(
      image.id,
      image.url,
      image.propertyId,
      image.createdAt,
      image.updatedAt,
    );
  }
}
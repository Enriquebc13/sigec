import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { RequestEntity } from '../../domain/entities/request.entity';
import { RequestStatus } from 'generated/prisma/enums';

@Injectable()
export class PrismaRequestRepository implements IRequestRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(request: RequestEntity): Promise<RequestEntity> {
    const created = await this.prisma.request.create({
      data: {
        id: request.id,
        telefono: request.telefono,
        userId: request.userId,
        propertyId: request.propertyId,
        status: request.status,
        createdAt: request.createdAt,
      },
    });
    return created as unknown as RequestEntity;
  }

  async findById(id: string): Promise<RequestEntity | null> {
    const request = await this.prisma.request.findUnique({ where: { id } });
    return request ? (request as unknown as RequestEntity) : null;
  }

  async findAll(): Promise<RequestEntity[]> {
    const requests = await this.prisma.request.findMany();
    return requests as unknown as RequestEntity[];
  }

  async findByUserId(userId: string): Promise<RequestEntity[]> {
    const requests = await this.prisma.request.findMany({ where: { userId } });
    return requests as unknown as RequestEntity[];
  }
  async updateStatus(id: string, status: RequestStatus): Promise<RequestEntity> {
    const updated = await this.prisma.request.update({
      where: { id },
      data: { status },
    });
    return updated as unknown as RequestEntity;
  }
  async delete(id: string): Promise<void> {
    await this.prisma.request.delete({ where: { id } });
  }
}
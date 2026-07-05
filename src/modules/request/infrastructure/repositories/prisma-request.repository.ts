import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { Request } from '../../domain/entities/request.entity';

@Injectable()
export class PrismaRequestRepository implements IRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: Request): Promise<Request> {
    const created = await this.prisma.request.create({
      data: {
        id: request.id,
        nombre: request.nombre,
        apellidos: request.apellidos,
        telefono: request.telefono,
        correo: request.correo,
        propertyId: request.propertyId,
        status: request.status,
        createdAt: request.createdAt,
      },
    });
    return created as unknown as Request;
  }

  async findById(id: string): Promise<Request | null> {
    const request = await this.prisma.request.findUnique({ where: { id } });
    return request ? (request as unknown as Request) : null;
  }

  async findAll(): Promise<Request[]> {
    const requests = await this.prisma.request.findMany();
    return requests as unknown as Request[];
  }

  async findByUserId(userId: string): Promise<Request[]> {
    const requests = await this.prisma.request.findMany({ where: { propertyId: userId } });
    return requests as unknown as Request[];
  }
}
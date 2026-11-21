import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import type {
  AutoRejectedRequest,
  CreatePropertyData,
  IPropertyRepository,
  UpdatePropertyData,
  UpdatePropertyResult,
} from '../../domain/interfaces/property.repository.interface';
import { PropertyStatus, RequestStatus } from 'generated/prisma/enums';
import type { Property } from '../../domain/entities/property.entity';

const propertyInclude = {
  address: true,
  images: { orderBy: { createdAt: 'asc' as const } },
};

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
      include: propertyInclude
    });
    return property as unknown as Property;
  }

async findAll(): Promise<Property[]> {
  const properties = await this.prisma.property.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: propertyInclude,
  });

  return properties as unknown as Property[];
}

  async findById(id: string): Promise<Property | null> {
    const property = await this.prisma.property.findUnique({ where: { id }, include: propertyInclude });
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
      include: propertyInclude
    });
    return property as unknown as Property;
  }

  /**
   * Actualiza la propiedad y sincroniza solicitudes en una sola transacción.
   *
   * - Pasa a RENTED (desde otro estado): las solicitudes PENDING -> REJECTED en lote.
   *   La APPROVED (la ganadora) no se toca.
   * - Pasa de RESERVED o RENTED a AVAILABLE: la solicitud APPROVED -> REJECTED
   *   (se cae el trato o se cancela el contrato), para no dejar una aprobación
   *   sin propiedad reservada ni rentada.
   * Repetir el mismo estado (p. ej. RENTED -> RENTED) no rechaza nada.
   */
  async updateWithRequestSync(
    id: string,
    data: UpdatePropertyData,
    actorUserId: string,
  ): Promise<UpdatePropertyResult> {
    return this.prisma.$transaction(async (tx) => {
      const current = await tx.property.findUnique({
        where: { id },
        select: { status: true, title: true },
      });
      if (!current) {
        throw new NotFoundException(`Propiedad con id ${id} no encontrada`);
      }

      const property = await tx.property.update({
        where: { id },
        data: this.buildUpdateData(data),
        include: propertyInclude,
      });

      // ¿Qué solicitudes hay que rechazar por este cambio de estado?
      const newStatus = data.status as PropertyStatus | undefined;
      let statusToReject: RequestStatus | null = null;
      if (newStatus && newStatus !== current.status) {
        if (newStatus === PropertyStatus.RENTED) {
          statusToReject = RequestStatus.PENDING;
        } else if (
          (current.status === PropertyStatus.RESERVED ||
            current.status === PropertyStatus.RENTED) &&
          newStatus === PropertyStatus.AVAILABLE
        ) {
          statusToReject = RequestStatus.APPROVED;
        }
      }

      let autoRejectedRequests: AutoRejectedRequest[] = [];

      if (statusToReject) {
        const affected = await tx.request.findMany({
          where: { propertyId: id, status: statusToReject },
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, name: true, lastname: true, email: true } },
          },
        });

        if (affected.length > 0) {
          const ids = affected.map((r) => r.id);

          await tx.request.updateMany({
            where: { id: { in: ids }, status: statusToReject },
            data: { status: RequestStatus.REJECTED },
          });

          await tx.requestHistory.createMany({
            data: ids.map((requestId) => ({
              action: 'REJECTED' as const,
              requestId,
              userId: actorUserId,
            })),
          });

          autoRejectedRequests = affected.map((r) => ({
            id: r.id,
            telefono: r.telefono,
            previousStatus: statusToReject as 'PENDING' | 'APPROVED',
            applicant: r.user,
            propertyId: id,
            propertyTitle: property.title,
          }));
        }
      }

      return { property: property as unknown as Property, autoRejectedRequests };
    });
  }

  /** Mapea el DTO de actualización al formato de Prisma (mismo que usa update). */
  private buildUpdateData(data: UpdatePropertyData) {
    return {
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
    };
  }

  async delete(id: string): Promise<void> {
  try {
    await this.prisma.property.delete({
      where: { id },
    });
  } catch (error: any) {
    if (error?.code === 'P2003') {
      throw new ConflictException(
        'No se puede eliminar esta propiedad porque tiene solicitudes asociadas.',
      );
    }

    throw error;
  }
}
}
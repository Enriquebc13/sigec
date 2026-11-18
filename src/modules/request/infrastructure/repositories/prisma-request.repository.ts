import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import {
  IRequestRepository,
  RequestFilters,
  RequestWithRelations,
} from '../../domain/interfaces/request.repository.interface';
import { RequestEntity } from '../../domain/entities/request.entity';
import { PropertyStatus, RequestStatus } from 'generated/prisma/enums';

// Último evento del historial de cada solicitud: sirve para saber quién la rechazó
const lastEventInclude = {
  history: {
    orderBy: { changedAt: 'desc' as const },
    take: 1,
    select: { action: true, userId: true },
  },
};

/**
 * Una solicitud REJECTED cuyo último evento lo hizo su propio dueño fue
 * cancelada por el solicitante (no rechazada por un admin).
 */
function withCancelledFlag<
  T extends {
    status: RequestStatus;
    userId: string;
    history: { action: string; userId: string }[];
  },
>(request: T) {
  const { history, ...rest } = request;
  const last = history[0];
  return {
    ...rest,
    cancelledByApplicant:
      request.status === RequestStatus.REJECTED &&
      last?.action === 'REJECTED' &&
      last.userId === request.userId,
  };
}

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

  /**
   * Listado administrativo: incluye solicitante y propiedad, y permite filtrar
   * por propertyId y/o status. Más recientes primero.
   */
  async findAllWithRelations(filters: RequestFilters = {}): Promise<RequestWithRelations[]> {
    const requests = await this.prisma.request.findMany({
      where: {
        ...(filters.propertyId ? { propertyId: filters.propertyId } : {}),
        ...(filters.status ? { status: filters.status } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, lastname: true, email: true } },
        property: { select: { id: true, title: true, status: true } },
        ...lastEventInclude,
      },
    });
    return requests.map(withCancelledFlag) as unknown as RequestWithRelations[];
  }

  async findByUserId(userId: string): Promise<RequestEntity[]> {
    const requests = await this.prisma.request.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: lastEventInclude,
    });
    return requests.map(withCancelledFlag) as unknown as RequestEntity[];
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

  /**
   * Posición dinámica en la lista de espera = número de solicitudes PENDING
   * de la propiedad con createdAt <= createdAt de la solicitud (ella incluida).
   * Si una solicitud anterior pasa a REJECTED/APPROVED o se elimina, deja de
   * contarse y todas las posteriores suben un puesto sin ningún UPDATE.
   */
  async countPendingUpTo(propertyId: string, createdAt: Date): Promise<number> {
    return this.prisma.request.count({
      where: {
        propertyId,
        status: RequestStatus.PENDING,
        createdAt: { lte: createdAt },
      },
    });
  }

  /**
   * Aprobación atómica (rollback completo si algo falla):
   * 1. Request: PENDING -> APPROVED (updateMany con guarda de estado, así dos
   *    admins aprobando a la vez no pasan ambos).
   * 2. Property: AVAILABLE -> propertyStatus (misma guarda; garantiza que solo
   *    exista UNA solicitud aprobada por propiedad).
   * 3. Historial: registro APPROVED.
   * Las demás solicitudes PENDING no se tocan.
   */
  async approve(
    requestId: string,
    adminUserId: string,
    propertyStatus: PropertyStatus,
  ): Promise<RequestEntity> {
    return this.prisma.$transaction(async (tx) => {
      const target = await tx.request.findUnique({ where: { id: requestId } });
      if (!target) {
        throw new NotFoundException(`Solicitud ${requestId} no encontrada`);
      }

      const approvedRows = await tx.request.updateMany({
        where: { id: requestId, status: RequestStatus.PENDING },
        data: { status: RequestStatus.APPROVED },
      });
      if (approvedRows.count === 0) {
        throw new ConflictException('La solicitud ya no está pendiente.');
      }

      const propertyRows = await tx.property.updateMany({
        where: { id: target.propertyId, status: PropertyStatus.AVAILABLE },
        data: { status: propertyStatus },
      });
      if (propertyRows.count === 0) {
        throw new ConflictException(
          'La propiedad no está disponible para aprobar una solicitud.',
        );
      }

      await tx.requestHistory.create({
        data: { action: 'APPROVED', requestId, userId: adminUserId },
      });

      const approved = await tx.request.findUniqueOrThrow({ where: { id: requestId } });
      return approved as unknown as RequestEntity;
    });
  }

  /**
   * Rechazo de una solicitud APPROVED (el trato se cayó), atómico:
   * 1. Request: APPROVED -> REJECTED (con guarda de estado).
   * 2. Property: RESERVED -> AVAILABLE (solo si seguía RESERVED; si el admin ya
   *    la movió a otro estado, no se toca).
   * 3. Historial: registro REJECTED.
   * El siguiente PENDING de la fila vuelve a ser el puesto 1 por el conteo dinámico.
   */
  async rejectApproved(requestId: string, adminUserId: string): Promise<RequestEntity> {
    return this.prisma.$transaction(async (tx) => {
      const target = await tx.request.findUnique({ where: { id: requestId } });
      if (!target) {
        throw new NotFoundException(`Solicitud ${requestId} no encontrada`);
      }
      // Con la propiedad ya RENTED el contrato se termina editando la propiedad
      // a AVAILABLE (PUT /properties/:id), que rechaza esta solicitud.
      const property = await tx.property.findUnique({
        where: { id: target.propertyId },
        select: { status: true },
      });
      if (property?.status === PropertyStatus.RENTED) {
        throw new ConflictException(
          'La propiedad ya está rentada. Para terminar el contrato, cambia la propiedad a Disponible.',
        );
      }
      const rows = await tx.request.updateMany({
        where: { id: requestId, status: RequestStatus.APPROVED },
        data: { status: RequestStatus.REJECTED },
      });
      if (rows.count === 0) {
        throw new ConflictException('La solicitud ya no está aprobada.');
      }

      await tx.property.updateMany({
        where: { id: target.propertyId, status: PropertyStatus.RESERVED },
        data: { status: PropertyStatus.AVAILABLE },
      });

      await tx.requestHistory.create({
        data: { action: 'REJECTED', requestId, userId: adminUserId },
      });

      const rejected = await tx.request.findUniqueOrThrow({ where: { id: requestId } });
      return rejected as unknown as RequestEntity;
    });
  }

  /**
   * Cancelación hecha por el solicitante (atómica):
   * 1. Request: PENDING -> REJECTED, solo si es suya y sigue PENDING.
   * 2. Historial: REJECTED con el solicitante como autor.
   * No toca el schema: "cancelada" = rechazada por su propio dueño.
   */
  async cancel(requestId: string, userId: string): Promise<RequestEntity> {
    return this.prisma.$transaction(async (tx) => {
      const rows = await tx.request.updateMany({
        where: { id: requestId, userId, status: RequestStatus.PENDING },
        data: { status: RequestStatus.REJECTED },
      });
      if (rows.count === 0) {
        throw new ConflictException(
          'Solo se pueden cancelar solicitudes pendientes. Si ya fue aprobada, contacta al administrador.',
        );
      }

      await tx.requestHistory.create({
        data: { action: 'REJECTED', requestId, userId },
      });

      const cancelled = await tx.request.findUniqueOrThrow({ where: { id: requestId } });
      return { ...cancelled, cancelledByApplicant: true } as unknown as RequestEntity;
    });
  }

  /**
   * Corrección de teléfono por el solicitante (atómica). Solo PENDING o
   * APPROVED. No cambia createdAt, así que no mueve su lugar en la fila.
   */
  async updatePhone(
    requestId: string,
    telefono: string,
    userId: string,
  ): Promise<RequestEntity> {
    return this.prisma.$transaction(async (tx) => {
      const rows = await tx.request.updateMany({
        where: {
          id: requestId,
          userId,
          status: { in: [RequestStatus.PENDING, RequestStatus.APPROVED] },
        },
        data: { telefono },
      });
      if (rows.count === 0) {
        throw new ConflictException(
          'No se puede editar el teléfono de una solicitud rechazada o cancelada.',
        );
      }

      await tx.requestHistory.create({
        data: { action: 'UPDATED', requestId, userId },
      });

      const updated = await tx.request.findUniqueOrThrow({ where: { id: requestId } });
      return updated as unknown as RequestEntity;
    });
  }
}

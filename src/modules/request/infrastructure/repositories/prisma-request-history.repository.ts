import { Injectable } from '@nestjs/common';
import { IRequestHistoryRepository } from '../../domain/interfaces/request-history.repository.interface';
import { RequestHistory } from '../../domain/entities/request-history.entity';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class PrismaRequestHistoryRepository implements IRequestHistoryRepository {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(
        history: RequestHistory
    ): Promise<RequestHistory> {
        return this.prisma.requestHistory.create({

            data: {
                action: history.action as any,
                requestId: history.requestId,
                userId: history.userId,
            }
        });
    }

    async findAll() {
        return this.prisma.requestHistory.findMany({
            orderBy: {
                changedAt: 'desc',
            },
            include: {
                user: {
                    select: { id: true, name: true, lastname: true, email: true },
                },
                request: {
                    select: { id: true, nombre: true, apellidos: true, status: true },
                },
            },
        });
    }

}
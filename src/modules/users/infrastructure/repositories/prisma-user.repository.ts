import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(user: User): Promise<User> {
        const createdUser = await this.prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                lastname: user.lastname,
                password: user.password,
                role: user.role,
                active: user.active,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
        return createdUser as User;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        return user ? (user as User) : null;
    }
    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) return null;

        return {
            ...user,
            updatedAt: user.updatedAt ?? new Date(), 
        };
    }


    async findAll(): Promise<User[]> {
        const users = await this.prisma.user.findMany();
        return users as User[];
    }
}
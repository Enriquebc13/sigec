import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma.service';
import { adminUser, clientUser, mockProperty } from './helpers/fixtures';
import { loginAndGetToken } from './helpers/login-helper';

// E2E - Crear propiedad
// Requiere autenticación mas rol ADMIN
describe('POST /properties', () => {
    let app: INestApplication;

    const mockPrismaService = {
        user: { findUnique: jest.fn() },
        property: { create: jest.fn() },
    };

    const createDto = {
        title: 'Local comercial céntrico',
        description: 'Excelente ubicación',
        price: 15000,
        maintenanceCost: 500,
        dimensions: '80m2',
        floor: 1,
        type: 'LOCAL',
        amenities: 'baño, estacionamiento',
        address: {
            street: 'Av. Reforma 123',
            city: 'Izúcar de Matamoros',
            state: 'Puebla',
            zipCode: '74400',
        },
        userId: adminUser.id,
    };

    beforeAll(async () => {
        process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'testsecret';

        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue(mockPrismaService)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Caso normal: ADMIN autenticado crea una propiedad
    it('Debe crear una propiedad cuando el usuario es ADMIN', async () => {
        const token = await loginAndGetToken(app, mockPrismaService, adminUser);
        mockPrismaService.property.create.mockResolvedValue(mockProperty);

        return request(app.getHttpServer())
            .post('/properties')
            .set('Authorization', `Bearer ${token}`)
            .send(createDto)
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual(JSON.parse(JSON.stringify(mockProperty)));
            });
    });

    //Caso anormal: usuario autenticado pero sin el rol ADMIN
    it('Se rechaza la creacion si el usuario no es ADMIN', async () => {
        const token = await loginAndGetToken(app, mockPrismaService, clientUser);

        return request(app.getHttpServer())
            .post('/properties')
            .set('Authorization', `Bearer ${token}`)
            .send(createDto)
            .expect(403);
    });

    //Caso anormal: sin autenticación
    it('Debe rechazar la creación sin token', () => {
        return request(app.getHttpServer())
            .post('/properties')
            .send(createDto)
            .expect(401);
    });

    afterAll(async () => {
        await app.close();
    });
});
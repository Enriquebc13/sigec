import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma.service';
import { clientUser, mockProperty } from './helpers/fixtures';
import { loginAndGetToken } from './helpers/login-helper';

// E2E - Obtener todas las propiedades
// Requiere autenticación
describe('GET /properties', () => {
    let app: INestApplication;

    const mockPrismaService = {
        user: { findUnique: jest.fn() },
        property: { findMany: jest.fn() },
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

    //Caso normal: usuario autenticado obtiene la lista de propiedades
    it('Debe devolver la lista de propiedades', async () => {
        const token = await loginAndGetToken(app, mockPrismaService, clientUser);
        mockPrismaService.property.findMany.mockResolvedValue([mockProperty]);

        return request(app.getHttpServer())
            .get('/properties')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body)).toBe(true);
                expect(body).toEqual(JSON.parse(JSON.stringify([mockProperty])));
            });
    });

    //Caso anormal: sin autenticación
    it('Debe rechazar la petición si no hay token', () => {
        return request(app.getHttpServer()).get('/properties').expect(401);
    });

    afterAll(async () => {
        await app.close();
    });
});
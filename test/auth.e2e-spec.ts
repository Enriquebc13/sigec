import { INestApplication } from "@nestjs/common";
import request from 'supertest';
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { PrismaService } from "src/prisma.service";

// Test E2E para comprobar la autenticación de usuario y acceder a ruta protegida
describe('Acceder a ruta protegida', () => {
    let app: INestApplication;

    
    const mockUser = {
        id: 'admin-test-id',
        name: 'Admin',
        lastname: 'Test',
        email: 'admin.test@sigec.com',
        password: '$2b$10$VkgisqnDQNBfsbILSZIIuOILYh7jT3e9oRXufd8gY5CxNEFQmLegK',
        role: 'ADMIN',
        active: true,
        createdAt: new Date(),
        updatedAt: null,
    };

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
        },
    };

    
    beforeAll(async () => {
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
        // limpiar todos los mocks antes de cada caso
        jest.clearAllMocks();
    });

    // login test
    it(`/POST auth/login`, async () => {
        
        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

        const userTest = {
            email: 'admin.test@sigec.com',
            password: '12345678',
        };

        return request(app.getHttpServer())
            .post('/auth/login')
            .send(userTest)
            .expect(200)
            .then(({ body }) => {
                expect(body.access_token).toBeDefined();

                process.env.TOKEN = body.access_token;
            });
    });

    // caso anormal: credenciales inválidas
    it(`/POST auth/login (credenciales inválidas)`, async () => {
        // simular que no se encuentra el usuario
        mockPrismaService.user.findUnique.mockResolvedValue(null);

        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'no-existe@sigec.com', password: 'loquesea' })
            .expect(401);
    });

    // acceso sin token
    it(`GET users (sin token)`, () => {
        return request(app.getHttpServer())
            .get('/users')
            .expect(401);
    });

    // acceso con token
    it(`GET users (con token)`, () => {
        // simulacion de que Prisma devuelve la lista de usuarios
        mockPrismaService.user.findMany.mockResolvedValue([mockUser]);

        return request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body)).toBe(true);
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
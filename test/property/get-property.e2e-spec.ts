import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma.service';
import { clientUser, mockProperty } from './helpers/fixtures';
import { loginAndGetToken } from './helpers/login-helper';

// E2E - Obtener propiedad por ID
// Requiere solo autenticación 
describe('GET /properties/:id', () => {
  let app: INestApplication;

  const mockPrismaService = {
    user: { findUnique: jest.fn() },
    property: { findUnique: jest.fn() },
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

  //Caso normal: usuario autenticado obtiene una propiedad existente
  it('Debe devolver una propiedad por ID', async () => {
    const token = await loginAndGetToken(app, mockPrismaService, clientUser);
    mockPrismaService.property.findUnique.mockResolvedValue(mockProperty);

    return request(app.getHttpServer())
      .get(`/properties/${mockProperty.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(JSON.parse(JSON.stringify(mockProperty)));
      });
  });

  //Caso anormal: sin autenticación
  it('Debe rechazar la petición sin token', () => {
    return request(app.getHttpServer())
      .get(`/properties/${mockProperty.id}`)
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
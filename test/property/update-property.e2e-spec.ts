import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma.service';
import { adminUser, clientUser, mockProperty } from './helpers/fixtures';
import { loginAndGetToken } from './helpers/login-helper';

// E2E - Actualizar propiedad
// Requiere autenticación mas rol ADMIN 
describe('PUT /properties/:id', () => {
  let app: INestApplication;

  const mockPrismaService = {
    user: { findUnique: jest.fn() },
    property: { findUnique: jest.fn(), update: jest.fn() },
  };

  const updateDto = {
    price: 17500,
    status: 'RESERVED',
  };

  const updatedProperty = {
    ...mockProperty,
    price: 17500,
    status: 'RESERVED',
    updatedAt: new Date(),
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

  //Caso normal: ADMIN autenticado actualiza una propiedad
  it('Debe actualizar una propiedad cuando el usuario es ADMIN', async () => {
    const token = await loginAndGetToken(app, mockPrismaService, adminUser);
    // el use case primero busca la propiedad (findById) antes de actualizarla
    mockPrismaService.property.findUnique.mockResolvedValue(mockProperty);
    mockPrismaService.property.update.mockResolvedValue(updatedProperty);

    return request(app.getHttpServer())
      .put(`/properties/${mockProperty.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateDto)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(JSON.parse(JSON.stringify(updatedProperty)));
      });
  });

  //Caso anormal: se intenta actualizar una propiedad que no existe
  it('Debe fallar si la propiedad a actualizar no existe', async () => {
    const token = await loginAndGetToken(app, mockPrismaService, adminUser);
    mockPrismaService.property.findUnique.mockResolvedValue(null);

    return request(app.getHttpServer())
      .put(`/properties/id-inexistente`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateDto)
      .expect(404);
  });

  //Caso anormal: usuario autenticado pero sin rol ADMIN
  it('Debe rechazar la actualización si el usuario no es ADMIN', async () => {
    const token = await loginAndGetToken(app, mockPrismaService, clientUser);

    return request(app.getHttpServer())
      .put(`/properties/${mockProperty.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateDto)
      .expect(403);
  });

  //Caso anormal: sin autenticación
  it('Debe rechazar la actualización sin token', () => {
    return request(app.getHttpServer())
      .put(`/properties/${mockProperty.id}`)
      .send(updateDto)
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
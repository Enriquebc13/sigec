import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma.service';
import { adminUser, clientUser, mockProperty } from './helpers/fixtures';
import { loginAndGetToken } from './helpers/login-helper';

// E2E - Eliminar propiedad
// Requiere autenticación mas rol ADMIN 
describe('DELETE /properties/:id', () => {
  let app: INestApplication;

  const mockPrismaService = {
    user: { findUnique: jest.fn() },
    property: { findUnique: jest.fn(), delete: jest.fn() },
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

  //Caso normal: ADMIN autenticado elimina una propiedad
  it('Debe eliminar una propiedad cuando el usuario es ADMIN', async () => {
    const token = await loginAndGetToken(app, mockPrismaService, adminUser);
    // el use case primero busca la propiedad (findById) antes de eliminarla
    mockPrismaService.property.findUnique.mockResolvedValue(mockProperty);
    mockPrismaService.property.delete.mockResolvedValue(mockProperty);

    return request(app.getHttpServer())
      .delete(`/properties/${mockProperty.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ message: 'Propiedad eliminada correctamente' });
      });
  });

  //Caso anormal: se intenta eliminar una propiedad que no existe
  it('Debe fallar si la propiedad a eliminar no existe', async () => {
    const token = await loginAndGetToken(app, mockPrismaService, adminUser);
    mockPrismaService.property.findUnique.mockResolvedValue(null);

    return request(app.getHttpServer())
      .delete(`/properties/id-inexistente`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
      
  });

  //Caso anormal: usuario autenticado pero sin rol ADMIN
  it('Debe rechazar la eliminación si el usuario no es ADMIN', async () => {
    const token = await loginAndGetToken(app, mockPrismaService, clientUser);

    return request(app.getHttpServer())
      .delete(`/properties/${mockProperty.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  //Caso anormal: sin autenticación
  it('Debe rechazar la eliminación sin token', () => {
    return request(app.getHttpServer())
      .delete(`/properties/${mockProperty.id}`)
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
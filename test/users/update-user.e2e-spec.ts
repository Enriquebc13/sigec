import { INestApplication } from "@nestjs/common";
import request from 'supertest';
import {
  createMockUserRepository,
  createTestApp,
  loginAs,
  fakeAdmin,
  fakeClient,
} from './users.e2e-setup';

describe('Actualización de usuarios (PATCH /users/:id)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp(createMockUserRepository());
  });

  // FLUJO NORMAL: ADMIN autenticado actualiza un usuario con datos válidos
  it('ADMIN puede actualizar un usuario con datos válidos', async () => {
    const token = await loginAs(app, fakeAdmin.email);

    const updateData = {
      name: 'NombreActualizado',
    };

    return request(app.getHttpServer())
      .patch('/users/fake-client-id')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect(200)
      .then(({ body }) => {
        expect(body.name).toEqual(updateData.name);
      });
  });

  // FLUJO ANORMAL: datos inválidos (correo mal formado)
  it('No se puede actualizar un usuario con datos inválidos', async () => {
    const token = await loginAs(app, fakeAdmin.email);

    const invalidData = {
      email: 'no-es-correo__',
    };

    return request(app.getHttpServer())
      .patch('/users/fake-client-id')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData)
      .expect(400);
  });

  // FLUJO ANORMAL: CLIENT no tiene permisos para actualizar usuarios
  it('CLIENT no puede actualizar usuarios', async () => {
    const token = await loginAs(app, fakeClient.email);

    const updateData = {
      name: 'IntentoNoAutorizado',
    };

    return request(app.getHttpServer())
      .patch('/users/fake-admin-id')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect(403);
  });

  // FLUJO ANORMAL: sin token no se puede actualizar un usuario
  it('Sin token no se puede actualizar un usuario', () => {
    return request(app.getHttpServer())
      .patch('/users/fake-client-id')
      .send({ name: 'SinToken' })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
import { INestApplication } from "@nestjs/common";
import request from 'supertest';
import {
  createMockUserRepository,
  createTestApp,
  loginAs,
  fakeAdmin,
  fakeClient,
} from './users.e2e-setup';

describe('Eliminación de usuarios (DELETE /users/:id)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp(createMockUserRepository());
  });

  // FLUJO NORMAL: ADMIN autenticado elimina un usuario existente
  it('ADMIN puede eliminar un usuario', async () => {
    const token = await loginAs(app, fakeAdmin.email);

    return request(app.getHttpServer())
      .delete(`/users/${fakeClient.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.message).toBeDefined();
      });
  });

  // FLUJO ANORMAL: CLIENT no tiene permisos para eliminar usuarios
  it('CLIENT no puede eliminar usuarios', async () => {
    const token = await loginAs(app, fakeClient.email);

    return request(app.getHttpServer())
      .delete(`/users/${fakeAdmin.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  // FLUJO ANORMAL: sin token no se puede eliminar un usuario
  it('Sin token no se puede eliminar un usuario', () => {
    return request(app.getHttpServer())
      .delete(`/users/${fakeClient.id}`)
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
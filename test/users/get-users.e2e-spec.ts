import { INestApplication } from "@nestjs/common";
import request from 'supertest';
import {
  createMockUserRepository,
  createTestApp,
  loginAs,
  fakeAdmin,
  fakeClient,
} from './users.e2e-setup';

describe('Acceso a la lista de usuarios (GET /users)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp(createMockUserRepository());
  });

  it('ADMIN puede obtener la lista de usuarios', async () => {
    const token = await loginAs(app, fakeAdmin.email);

    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('CLIENT no puede obtener la lista de usuarios', async () => {
    const token = await loginAs(app, fakeClient.email);

    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('Sin token no se puede obtener la lista de usuarios', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
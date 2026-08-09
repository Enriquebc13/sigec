import { INestApplication } from "@nestjs/common";
import request from 'supertest';
import {
  createMockUserRepository,
  createTestApp,
  loginAs,
  fakeAdmin,
  fakeClient,
} from './users.e2e-setup';

describe('Creación de usuarios (POST /users)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp(createMockUserRepository());
  });

  // FLUJO NORMAL: ADMIN autenticado crea un usuario con datos válidos
  it('ADMIN puede crear un usuario con datos válidos', async () => {
    const token = await loginAs(app, fakeAdmin.email);

    const newUser = {
      email: 'nuevo@test.com',
      name: 'Nuevo',
      lastname: 'Usuario',
      password: '12345678',
      role: 'CLIENT',
    };

    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.email).toEqual(newUser.email);
      });
  });

  // FLUJO ANORMAL: datos inválidos (correo mal formado, campos faltantes)
  it('No se puede crear un usuario con datos inválidos', async () => {
    const token = await loginAs(app, fakeAdmin.email);

    const invalidUser = {
      email: 'no-es-un-correo',
      name: '',
      // faltan lastname, password y role
    };

    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidUser)
      .expect(400);
  });

  // FLUJO ANORMAL: CLIENT no tiene permisos para crear usuarios
  it('CLIENT no puede crear usuarios', async () => {
    const token = await loginAs(app, fakeClient.email);

    const newUser = {
      email: 'otro@test.com',
      name: 'Otro',
      lastname: 'Usuario',
      password: '12345678',
      role: 'CLIENT',
    };

    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(403);
  });

  // FLUJO ANORMAL: sin token no se puede crear un usuario
  it('Sin token no se puede crear un usuario', () => {
    const newUser = {
      email: 'sinToken@test.com',
      name: 'Sin',
      lastname: 'Token',
      password: '12345678',
      role: 'CLIENT',
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(newUser)
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
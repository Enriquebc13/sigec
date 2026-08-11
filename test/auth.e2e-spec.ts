import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

// Test E2E para comprobar la autenticación de usuario, y acceder
// a un recurso protegido con JWT (equivalente al "perfil" del ejemplo).
describe('Autenticación y acceso a recurso protegido', () => {
  let app: INestApplication;

  // Credenciales de un usuario ADMIN previamente creado (ver POST /users)
  const adminCredentials = {
    email: 'admin@ejemplo.com',
    password: '12345678',
  };

  let adminToken: string;
  let adminId: string;

  // preparar instancia de la aplicación completa
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // login test
  it('POST /auth/login - flujo normal: debe autenticar con credenciales válidas', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(adminCredentials)
      .expect(200);

    expect(response.body.access_token).toBeDefined();

    adminToken = response.body.access_token;

    // decodificamos el payload del JWT para obtener el id del usuario (sub)
    const payload = JSON.parse(
      Buffer.from(adminToken.split('.')[1], 'base64').toString('utf-8'),
    );
    adminId = payload.sub;
  });

  it('POST /auth/login - flujo anormal: debe rechazar credenciales inválidas', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminCredentials.email, password: 'passwordIncorrecta' })
      .expect(401);
  });

  // acceso sin token
  it('GET /users/:id - flujo anormal: sin token debe devolver 401', async () => {
    return request(app.getHttpServer())
      .get(`/users/${adminId}`)
      .expect(401);
  });

  // acceso con token válido
  it('GET /users/:id - flujo normal: con token ADMIN debe devolver el usuario', async () => {
    return request(app.getHttpServer())
      .get(`/users/${adminId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.email).toEqual(adminCredentials.email);
      });
  });
});
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';


describe('GET /requests', () => {
  let app: INestApplication;
  let clientToken: string;
  let adminToken: string;

  const propertyId = 'cmrk6ckh10000zavftndxr2pb';
  const clientEmail = `cliente.get.${Date.now()}@test.com`;
  const adminEmail = `admin.get.${Date.now()}@test.com`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
);
await app.init();

    
    await request(app.getHttpServer()).post('/users').send({
      email: clientEmail,
      name: 'Cliente',
      lastname: 'Prueba',
      password: '12345678',
      role: 'CLIENT',
    });
    await request(app.getHttpServer()).post('/users').send({
      email: adminEmail,
      name: 'Admin',
      lastname: 'Prueba',
      password: '12345678',
      role: 'ADMIN',
    });

    const clientLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: clientEmail, password: '12345678' });
    clientToken = clientLogin.body.access_token;

    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminEmail, password: '12345678' });
    adminToken = adminLogin.body.access_token;

    // el cliente crea una solicitud, para tener algo que consultar
    await request(app.getHttpServer())
      .post('/requests')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ telefono: '2221234567', propertyId });
  });

  afterAll(async () => {
    await app.close();
  });

  it('Flujo normal: usuario autenticado debe ver sus propias solicitudes', async () => {
    return request(app.getHttpServer())
      .get('/requests/my-requests')
      .set('Authorization', `Bearer ${clientToken}`)
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
      });
  });

  it('Flujo anormal: sin token debe devolver 401', async () => {
    return request(app.getHttpServer())
      .get('/requests/my-requests')
      .expect(401);
  });

  it('Flujo normal: ADMIN debe ver el historial completo de solicitudes', async () => {
    return request(app.getHttpServer())
      .get('/requests/history')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('Flujo anormal: CLIENT no debe poder ver el historial (solo ADMIN)', async () => {
    return request(app.getHttpServer())
      .get('/requests/history')
      .set('Authorization', `Bearer ${clientToken}`)
      .expect(403);
  });
});
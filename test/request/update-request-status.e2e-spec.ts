import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

describe('PATCH /requests/:id/status', () => {
  let app: INestApplication;
  let clientToken: string;
  let adminToken: string;
  let requestId: string;

  const propertyId = 'cmrk6ckh10000zavftndxr2pb';
  const clientEmail = `cliente.update.${Date.now()}@test.com`;
  const adminEmail = `admin.update.${Date.now()}@test.com`;

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

    // crear una solicitud para poder actualizarla
    const createResponse = await request(app.getHttpServer())
      .post('/requests')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ telefono: '2221234567', propertyId });

    requestId = createResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Flujo normal: ADMIN debe actualizar el estatus de una solicitud existente', async () => {
    return request(app.getHttpServer())
      .patch(`/requests/${requestId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'APPROVED' })
      .expect(200)
      .then(({ body }) => {
        expect(body.status).toEqual('APPROVED');
      });
  });

  it('Flujo anormal: un CLIENT no debe poder actualizar el estatus (solo ADMIN)', async () => {
    return request(app.getHttpServer())
      .patch(`/requests/${requestId}/status`)
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ status: 'REJECTED' })
      .expect(403);
  });

  it('Flujo anormal: debe devolver 404 si la solicitud no existe', async () => {
    return request(app.getHttpServer())
      .patch('/requests/id-que-no-existe/status')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'APPROVED' })
      .expect(404);
  });
});
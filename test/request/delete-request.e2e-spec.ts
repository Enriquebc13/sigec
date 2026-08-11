import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('DELETE /requests/:id', () => {
  let app: INestApplication;
  let ownerToken: string;
  let otherClientToken: string;
  let requestId: string;

  const propertyId = 'cmrk6ckh10000zavftndxr2pb';
  const ownerEmail = `cliente.owner.${Date.now()}@test.com`;
  const otherEmail = `cliente.otro.${Date.now()}@test.com`;

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
      email: ownerEmail,
      name: 'Cliente',
      lastname: 'Dueño',
      password: '12345678',
      role: 'CLIENT',
    });

    await request(app.getHttpServer()).post('/users').send({
      email: otherEmail,
      name: 'Cliente',
      lastname: 'Otro',
      password: '12345678',
      role: 'CLIENT',
    });

    const ownerLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: ownerEmail, password: '12345678' });
    ownerToken = ownerLogin.body.access_token;

    const otherLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: otherEmail, password: '12345678' });
    otherClientToken = otherLogin.body.access_token;

    // el dueño crea la solicitud que se va a intentar eliminar
    const createResponse = await request(app.getHttpServer())
      .post('/requests')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ telefono: '2221234567', propertyId });

    requestId = createResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Flujo anormal: sin token debe devolver 401', async () => {
    return request(app.getHttpServer())
      .delete(`/requests/${requestId}`)
      .expect(401);
  });

  it('Flujo anormal: otro usuario no debe poder eliminar una solicitud que no es suya', async () => {
    return request(app.getHttpServer())
      .delete(`/requests/${requestId}`)
      .set('Authorization', `Bearer ${otherClientToken}`)
      .expect(403);
  });

  it('Flujo normal: el dueño debe poder eliminar su propia solicitud', async () => {
    return request(app.getHttpServer())
      .delete(`/requests/${requestId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);
  });
});
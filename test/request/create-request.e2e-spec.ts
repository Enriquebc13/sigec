import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';


describe('CREATE /requests', () => {
  let app: INestApplication;
  let clientToken: string;

  const propertyId = 'cmrk6ckh10000zavftndxr2pb';
  const testEmail = `cliente.create.${Date.now()}@test.com`;

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
      email: testEmail,
      name: 'Cliente',
      lastname: 'Prueba',
      password: '12345678',
      role: 'CLIENT',
    });

    //esto es para obtener el token y no tenga que estar creando usuarios y se hagan solitos
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: '12345678' });

    clientToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Flujo normal: usuario autenticado debe crear una solicitud', async () => {
    return request(app.getHttpServer())
      .post('/requests')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ telefono: '2221234567', propertyId })
      .expect(201)
      .then(({ body }) => {
        expect(body.telefono).toEqual('2221234567');
        expect(body.propertyId).toEqual(propertyId);
        expect(body.status).toEqual('PENDING');
      });
  });

  it('Flujo anormal: sin token debe devolver 401', async () => {
    return request(app.getHttpServer())
      .post('/requests')
      .send({ telefono: '2221234567', propertyId })
      .expect(401);
  });

  it('Flujo anormal: datos incompletos deben devolver 400', async () => {
    return request(app.getHttpServer())
      .post('/requests')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ propertyId }) // falta 'telefono'
      .expect(400);
  });
});
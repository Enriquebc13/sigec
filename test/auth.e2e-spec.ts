import { INestApplication } from "@nestjs/common";
import request from 'supertest';
import { Test } from "@nestjs/testing";
import * as bcrypt from 'bcrypt';
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma.service";

describe('Acceder al perfil de usuario', () => {
  let app: INestApplication;

  const testPassword = '12345678';
  const fakeUser = {
    id: 'fake-id-123',
    name: 'Enrique',
    lastname: 'Baez',
    email: 'EnriqueBaez@gmail.com',
    password: bcrypt.hashSync(testPassword, 10),
    role: 'ADMIN',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    findByEmail: jest.fn().mockResolvedValue(fakeUser),
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  // mock de PrismaService: evita que intente conectarse de verdad
  const mockPrismaService = {
    onModuleInit: jest.fn(),
    onModuleDestroy: jest.fn(),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('IUserRepository')
      .useValue(mockUserRepository)
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST auth/login`, async () => {
    const userTest = {
      email: fakeUser.email,
      password: testPassword,
    };

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(userTest)
      .expect(200)
      .then(({ body }) => {
        expect(body.access_token).toBeDefined();
        process.env.TOKEN = body.access_token;
      });
  });

  it(`/GET auth/profile sin token`, () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .expect(401);
  });

  it(`/GET auth/profile con token`, async () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.email).toEqual(fakeUser.email);
        expect(body.role).toEqual(fakeUser.role);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
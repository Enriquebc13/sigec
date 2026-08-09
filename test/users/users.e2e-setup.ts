import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/prisma.service";

export const testPassword = '12345678';

export const fakeAdmin = {
  id: 'fake-admin-id',
  name: 'Enrique',
  lastname: 'Baez',
  email: 'admin@test.com',
  password: bcrypt.hashSync(testPassword, 10),
  role: 'ADMIN',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const fakeClient = {
  id: 'fake-client-id',
  name: 'Carlos',
  lastname: 'Lopez',
  email: 'client@test.com',
  password: bcrypt.hashSync(testPassword, 10),
  role: 'CLIENT',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// factory: crea un mock "limpio" del repositorio en cada archivo,
// para que jest.fn() no arrastre llamadas entre archivos distintos
export function createMockUserRepository() {
  return {
    findByEmail: jest.fn((email: string) => {
      if (email === fakeAdmin.email) return Promise.resolve(fakeAdmin);
      if (email === fakeClient.email) return Promise.resolve(fakeClient);
      return Promise.resolve(null);
    }),
    findAll: jest.fn().mockResolvedValue([fakeAdmin, fakeClient]),
    create: jest.fn((data) => Promise.resolve({ id: 'new-fake-id', ...data })),
    findById: jest.fn((id: string) => {
      if (id === fakeAdmin.id) return Promise.resolve(fakeAdmin);
      if (id === fakeClient.id) return Promise.resolve(fakeClient);
      return Promise.resolve(null);
    }),
    // regresa el usuario base (según el id) combinado con los datos nuevos
    update: jest.fn((id: string, data: any) => {
      const base = id === fakeAdmin.id ? fakeAdmin : fakeClient;
      return Promise.resolve({ ...base, ...data });
    }),
    delete: jest.fn((id: string) =>
      Promise.resolve({ message: 'Usuario eliminado correctamente' }),
    ),
  };
}

export const mockPrismaService = {
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

// levanta la app con los mocks ya aplicados
export async function createTestApp(mockUserRepository: ReturnType<typeof createMockUserRepository>) {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider('IUserRepository')
    .useValue(mockUserRepository)
    .overrideProvider(PrismaService)
    .useValue(mockPrismaService)
    .compile();

  const app = moduleRef.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.init();
  return app;
}

// helper para hacer login y obtener el token directamente
export async function loginAs(app: INestApplication, email: string) {
  const res = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password: testPassword });

  return res.body.access_token;
}
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

/**
 * Hace login real contra POST /auth/login, simulando que Prisma encuentra
 * al usuario indicado, y regresa el token obtenido.
 *
 * @param app instancia de la aplicación de prueba
 * @param mockPrismaService el mock de PrismaService usado en el modulo de test
 * @param user el usuario (admin o client) que se simulara en la bd
 */
export async function loginAndGetToken(
  app: INestApplication,
  mockPrismaService: any,
  user: { email: string },
): Promise<string> {
  mockPrismaService.user.findUnique.mockResolvedValueOnce(user);

  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: user.email, password: '12345678' })
    .expect(200);

  return response.body.access_token;
}
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';

//Importar usermodule

import { AuthController } from './infrastructure/controllers/auth.controller';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

import { LoginUseCase } from './application/use-cases/login.use-case';
import { UsersModule } from 'src/modules/users/users.module';
import type { IUserRepository } from 'src/modules/users/domain/interfaces/user.repository.interface';
import { RolesGuard } from './infrastructure/guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dtrfi76tg8768g5r867g4',
      signOptions: {
        expiresIn: (process.env.JWT_EXP || '24h') as any,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    RolesGuard,
    {
      provide: LoginUseCase,
      useFactory: (userRepo: IUserRepository, jwtService: JwtService) =>
        new LoginUseCase(userRepo, jwtService),
      inject: ['IUserRepository', JwtService],
    },
  ],
})
export class AuthModule { }
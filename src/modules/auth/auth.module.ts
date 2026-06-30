import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

//Importar usermodule

import { AuthController } from './infrastructure/controllers/auth.controller';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

import { LoginUseCase } from './application/use-cases/login.use-case';
import { UsersModule } from 'src/modules/users/users.module';
import type { IUserRepository } from 'src/modules/users/domain/interfaces/user.repository.interface';
import { RolesGuard } from './infrastructure/guards/roles.guard';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXP') || '24h') as `${number}${'s' | 'm' | 'h' | 'd'}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: LoginUseCase,
      useFactory: (userRepo: IUserRepository, jwtService: JwtService) =>
        new LoginUseCase(userRepo, jwtService),
      inject: ['IUserRepository', JwtService],
    },
  ],
  exports: [JwtAuthGuard, RolesGuard],
})
export class AuthModule { }
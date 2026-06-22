import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

//Importar usermodule

import { AuthController } from './infrastructure/controllers/auth.controller';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

import { LoginUseCase } from './application/use-cases/login.use-case';

@Module({
  imports: [
    // UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXP as any,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
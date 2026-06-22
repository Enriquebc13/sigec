import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private loginUseCase: LoginUseCase) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.loginUseCase.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
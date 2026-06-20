import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // Credencial estatica, conectas con la BD/ este nomas lo cree para que no me marque error en
    //local.strategy.ts
    if (username === 'test' && pass === '123456') {
      return { id: 1, username: 'test' };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
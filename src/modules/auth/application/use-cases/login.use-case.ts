import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from 'src/modules/users/domain/interfaces/user.repository.interface';

@Injectable()
export class LoginUseCase {
    constructor(
        //private usersService: UsersService,
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        //Agregar logica de users
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new UnauthorizedException('Credenciales inválidas');
        //ToDo: Comparar contraseña cifrada
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');
        const { password, ...result } = user;
        return result;

    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}

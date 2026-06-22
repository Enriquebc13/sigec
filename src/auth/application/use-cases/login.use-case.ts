import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service'; // Cambbiar la importacion


@Injectable()
export class LoginUseCase {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
         //Agregar logica de users
        const user = await this.usersService.findOne(username);
        //ToDo: Comparar contraseña cifrada
        if (user && user.password === pass) {
            const {password, ...result} = user;
            return result;
        }
        //Agregar logica de users
        const userFromDb = await this.usersService.findOneFromDb(username);
        if (userFromDb && (await bcrypt.compare(pass, userFromDb.password))) {
            const { password, ...result } = userFromDb;
            return result;
        }

        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id};
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}

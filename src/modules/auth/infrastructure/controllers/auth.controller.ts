import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { Public } from "../decorators/public.decorator";
import { LoginUseCase } from "src/modules/auth/application/use-cases/login.use-case";

@Controller('auth')
export class AuthController {
    constructor(private LoginUseCase: LoginUseCase) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    singIn(@Request() req) {
        console.log('Usuario que inició sesión:', req.user);
        console.log(`Inicio de sesión: ${req.user.email}`);
        return this.LoginUseCase.login(req.user);
    }
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('auth/logout')
    async logout(@Request() req) {
        return req.logout();
    }
}
import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { Public } from "../decorators/public.decorator";
import { LoginUseCase } from "src/modules/auth/application/use-cases/login.use-case";

@Controller('auth')
export class AuthController {
    constructor(private LoginUseCase: LoginUseCase){}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    singIn(@Request() req) {
        return this.LoginUseCase.login(req.user);
    }
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('auth/logout')
    async logout(@Request()req){
        return req.logout();
    }
}
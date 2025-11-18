import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
    constructor(private readonly loginService:LoginService){}

    @Post('signup')
    async signup(@Body() body: { username:string,password:string}){
        return this.loginService.signup(body.username,body.password);
    }

    @Post('login')
    async login(@Body() body: {username:string,password:string}){
        return this.loginService.login(body.username,body.password);
    }
}

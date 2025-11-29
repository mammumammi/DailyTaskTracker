import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/login/user.entity";
import { JwtStrategy } from "./jwt.strategy";
import { AuthService } from './auth.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([User]),
        PassportModule.register({ defaultStrategy: 'jwt'}),
        JwtModule.register({
            secret:process.env.JWT_SECRET || 'MysecretKey123',
            signOptions: {"expiresIn":'1h'},
        }),
    ],
    providers: [AuthService,JwtStrategy],
    exports:[AuthService,JwtStrategy,PassportModule,JwtModule]
})

export class AuthModule {}
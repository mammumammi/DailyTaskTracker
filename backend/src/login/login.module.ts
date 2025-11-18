import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule} from '@nestjs/jwt';
@Module({
  imports:[TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret:'MysecretKey123',
    signOptions:{expiresIn:'1h'}
  })
],
  controllers: [LoginController],
  
  providers: [LoginService]
})
export class LoginModule {}

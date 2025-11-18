import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { TypeOrmModule} from '@nestjs/typeorm';
import { User } from './login/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host: 'localhost',
      username: 'root',
      password: '',
      database: 'tracker_db',
      entities: [User],
      synchronize:true,
      extra: {
        socketPath: '/System/Volumes/Data/private/tmp/mysql.sock',
      },
    }),LoginModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

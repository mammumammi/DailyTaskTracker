import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { TypeOrmModule} from '@nestjs/typeorm';
import { User } from './login/user.entity';
import { TaskModule } from './task/task.module';
import { CategoryModule } from './category/category.module';
import { Task } from './entities/task.entity';
import { Category } from './entities/category.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host: 'localhost',
      username: 'root',
      password: '',
      database: 'tracker_db',
      entities: [User,Task,Category],
      synchronize:true,
      extra: {
        socketPath: '/System/Volumes/Data/private/tmp/mysql.sock',
      },
    }),LoginModule, TaskModule, CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

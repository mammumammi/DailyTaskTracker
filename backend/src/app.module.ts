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
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './ormconfig';
import {ConfigModule} from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),LoginModule, TaskModule, CategoryModule,AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

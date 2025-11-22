import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/login/user.entity';
import { Category } from 'src/entities/category.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Task,User,Category])],
  providers: [TaskService],
  controllers: [TaskController]
})
export class TaskModule {}

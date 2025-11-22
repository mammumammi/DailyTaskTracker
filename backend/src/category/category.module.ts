import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/login/user.entity';
import { Task } from 'src/entities/task.entity';
import { Category } from 'src/entities/category.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Task,Category])],
  providers: [CategoryService],
  controllers: [CategoryController]
})
export class CategoryModule {}

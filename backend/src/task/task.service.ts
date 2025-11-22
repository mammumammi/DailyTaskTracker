import { Injectable, NotFoundException } from '@nestjs/common';
import { createTaskDto } from './createTask.dto';
import { Task } from 'src/entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/login/user.entity';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private taskRepo:Repository<Task>,
        @InjectRepository(User)
        private userRepo:Repository<User>,
        @InjectRepository(Category)
        private categoryRepo:Repository<Category>
    ) {}
    async create(dto:createTaskDto){
        const task = new Task();
        task.name= dto.name;
        task.start_time = dto.start_time;
        task.end_time = dto.end_time;
        task.date = dto.date;
        task.formattedDate = dto.formattedDate;
        task.no_of_hours = dto.no_of_hours;

        const user = await this.userRepo.findOne({where: { id:dto.userId}});
        if (!user){
            throw new NotFoundException("User not found");
        }
        task.user = user!;
        
        task.categories = await this.categoryRepo.find({where: {id:In(dto.categoryIds)}})

        return this.taskRepo.save(task);
    }

    async FindAll(id:number){
        return this.taskRepo.find({where: {user:{id:id}},relations:['categories','user']})
    };
    
}

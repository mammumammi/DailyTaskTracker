import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { createCategoryDto } from 'src/entities/createCategory.dto';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/login/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(User)
        private userRepo:Repository<User>,
        @InjectRepository(Category)
        private categoryRepo:Repository<Category>,
        @InjectRepository(Task)
        private taskRepo:Repository<Task>
    ){}

    async create(dto:createCategoryDto){
        const category  = new Category();
        category.colour = dto.colour;
        category.name = dto.name;
        
        return this.categoryRepo.save(category);
    }

    async findAll(){
        return this.categoryRepo.find({
            relations:["task"]
        })
    }
}

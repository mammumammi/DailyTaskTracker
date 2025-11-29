import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

    async create(dto:createCategoryDto,userId:number){
        const category  = new Category();
        category.colour = dto.colour;
        category.name = dto.name;

        const user = await this.userRepo.findOne({where: { id:userId}});
        if (!user){
            throw new NotFoundException("User not Found");
        }
        category.user = user;
        
        return this.categoryRepo.save(category);
    }

    async findAll(userId:number){
        return this.categoryRepo.find({
            where: { user: { id: userId}},
            relations:["user","task"]
        })
    }
}

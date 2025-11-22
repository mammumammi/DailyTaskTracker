import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { createCategoryDto } from 'src/entities/createCategory.dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService:CategoryService){}

    @Post()
    createTask(@Body() dto:createCategoryDto){
        return this.categoryService.create(dto);
    }

    @Get()
    FindAll(){
        return this.categoryService.findAll();
    }
}

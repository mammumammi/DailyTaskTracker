import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { createCategoryDto } from 'src/entities/createCategory.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService:CategoryService){}

    @UseGuards(JwtAuthGuard)
    @Post()
    createTask(@Body() dto:createCategoryDto,@Req() req){
        return this.categoryService.create(dto,req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    FindAll( @Req() req){
        return this.categoryService.findAll(Number(req.user.sub));
    }
} 

import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { createTaskDto } from './createTask.dto';
import { TaskService } from './task.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('task')
export class TaskController {

    constructor(private readonly taskService:TaskService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    createTask(@Body() dto:createTaskDto,@Req() req ){
        return this.taskService.create(dto,req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Req() req ){
        return this.taskService.FindAll(Number(req.user.sub));
    }
}

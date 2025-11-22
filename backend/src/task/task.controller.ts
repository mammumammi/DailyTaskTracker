import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { createTaskDto } from './createTask.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {

    constructor(private readonly taskService:TaskService){}

    @Post()
    createTask(@Body() dto:createTaskDto ){
        return this.taskService.create(dto);
    }
    @Get(':userId')
    findAll(@Param('userId') userId:string){
        return this.taskService.FindAll(Number(userId));
    }
}

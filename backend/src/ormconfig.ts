import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "./login/user.entity";
import { Category } from "./entities/category.entity";
import { Task } from "./entities/task.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities:[User,Category,Task],
    synchronize:true,
    ssl : {rejectUnauthorized:false}
}
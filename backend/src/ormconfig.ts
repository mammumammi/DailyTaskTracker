import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "./login/user.entity";
import { Category } from "./entities/category.entity";
import { Task } from "./entities/task.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, Category, Task],
    autoLoadEntities:true,
    synchronize: true, // Auto-create tables (disable in production!)
    ssl: {
        rejectUnauthorized: false
    },
    logging: true, // See SQL queries in console
}
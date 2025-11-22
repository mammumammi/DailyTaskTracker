import { Task } from "src/entities/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique: true})
    username:string;

    @Column()
    password:string;

    @OneToMany( ()=> Task,(tasks) =>tasks.user)
    tasks:Task[];


}
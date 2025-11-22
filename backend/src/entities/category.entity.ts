import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class Category{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    colour:string;

    @Column()
    name:string;

    @ManyToOne(()=> Task,(task) =>task.categories,{onDelete:"CASCADE"})
    task:Task
}
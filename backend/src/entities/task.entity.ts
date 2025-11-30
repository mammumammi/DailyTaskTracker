import { User } from "src/login/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Task{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    start_time:string;

    @Column()
    end_time:string;

    @Column({type:"timestamp"})
    date:Date;

    @Column({type:"varchar"})
    formattedDate:string;

    @Column()
    no_of_hours:number;

    @ManyToOne( ()=> User,user => user.tasks,{onDelete:"CASCADE"})
    user:User;

   @OneToMany(()=> Category,(category) => category.task)
   categories:Category[];

}
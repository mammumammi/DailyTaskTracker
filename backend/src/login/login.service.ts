import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class LoginService {

    constructor(
        @InjectRepository(User)
        private userRepo:Repository<User>,
        private jwtService:JwtService
    ){}

    async signup(username:string,password:string){
        const existingUser = await this.userRepo.findOne({where: {username}});
        if (existingUser){
            throw new UnauthorizedException('User already exists');
        }

        const hashed = await bcrypt.hash(password,10);
        const newUser = await this.userRepo.create({username,password:hashed});
        await this.userRepo.save(newUser);

        const payload = {username:newUser.username,sub:newUser.id};
        const token = this.jwtService.sign(payload);

        return { access_token: token,userId:newUser.id};
    }

    async login(username:string,password:string){
        const user = await this.userRepo.findOne({where: {username}});
        if (!user){
            throw new UnauthorizedException('Username Invalid');
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch){
            throw new UnauthorizedException('Invalid Password');
        }

        const payload = {username:user.username,sub:user.id};
        const token =  this.jwtService.sign(payload);

        return {access_token:token};
    }

}

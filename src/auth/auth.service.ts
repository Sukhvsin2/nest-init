import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2"

@Injectable()
export class AuthService{
    constructor(private prismaService: PrismaService){}
    
    async signup(dto: AuthDto){
        // generate the new password from hash
        const hash = await argon.hash(dto.password.toString());

        const userData = {
            email: dto.email.toString(),
            hash,
        }
        // save the new user
        const user = await this.prismaService.user.create({
            data: userData
        })

        // return the new user creation
        return user
    }
    login(){
        return 'This is Login Route.'
    }
}
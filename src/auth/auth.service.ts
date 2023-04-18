import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2"
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService{
    constructor(private prismaService: PrismaService, private jwt: JwtService, private config: ConfigService){}
    
    async signup(dto: AuthDto){
        // generate the new password from hash
        const hash = await argon.hash(dto.password.toString());
        try {
            // save the new user in db
            const user = await this.prismaService.user.create({
                data: {
                  email: dto.email.toString(),
                  hash,
                },
              });
            // return the new user creation
          return this.signToken((await user).id, (await user).email);
        } catch (error) {
          
            if (error.code === 'P2002') {
              throw new ForbiddenException(
                'Credentials taken',
              );
            }
          console.log(error);
          
          throw error;
        }
    }
    async login(dto: AuthDto){
        // find the user in db
        const user = this.prismaService.user.findUnique({
            where:{
                email: dto.email.toString(), 
            }
        });
        
        // if user doesn't exist throw error
        if(!user) throw new ForbiddenException("Incorrect Credentials!");

        // conform password
        const pwMatches = await argon.verify((await user).hash.toString(), dto.password.toString())
        // if user's password doesn't match throw error
        if(!pwMatches) throw new ForbiddenException("Incorrect Credentials!");

        // return the user
        return this.signToken((await user).id, (await user).email);
    }

    async signToken(userId: number, email: String){
      const payload = {
        sub: userId,
        email
      }

      const token = await this.jwt.signAsync(payload, {expiresIn: "15m", secret: this.config.get("SECRET")})

      return {
        access_token: token
      }
    }
}
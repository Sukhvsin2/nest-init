import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard';
import { GetUser, GetUserEmail } from 'src/auth/decorator';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @UseGuards(JwtAuthGuard)
    @Get()
    getMe(@GetUser() user: User){
        return this.userService.getMe(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('email')
    getMeEmail(@GetUserEmail() user: User){
        return this.userService.getEmail(user);
    }
}

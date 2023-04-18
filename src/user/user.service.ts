import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    getMe(user: User){
        return user
    }
    getEmail(user: User){
        return {
            "email": user
        }
    }
}

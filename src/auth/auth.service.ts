import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService{
    signup(){
        return 'This is Signup Route.'
    }
    login(){
        return 'This is Login Route.'
    }
}
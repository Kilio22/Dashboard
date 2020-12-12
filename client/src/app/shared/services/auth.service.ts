import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isLogin = true;

    isLoggedIn(): boolean {
        return this.isLogin;
    }

    setIsLogin(value: boolean): void {
        this.isLogin = value;
    }
}

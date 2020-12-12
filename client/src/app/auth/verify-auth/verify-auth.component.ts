import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-verify-auth',
    templateUrl: './verify-auth.component.html',
    styleUrls: [ './verify-auth.component.scss' ]
})
export class VerifyAuthComponent implements OnInit {

    constructor(private httpClient: HttpClient, private authService: AuthService, private router: Router) {
    }

    ngOnInit(): void {
        this.httpClient.get<boolean>('/api/auth/ping', {
            withCredentials: true
        }).subscribe(async (_) => {
            this.authService.setIsLogin(true);
            await this.router.navigateByUrl('/home');
        }, async (error) => {
            this.authService.setIsLogin(false);
            await this.router.navigateByUrl('/auth/login');
        });
    }

}

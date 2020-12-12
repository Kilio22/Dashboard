import { Component, OnDestroy } from '@angular/core';
import { NbAuthResult, NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../shared/services/auth.service';

interface IResponse {
    token: string;
}

@Component({
    selector: 'app-office-oauth-callback',
    templateUrl: './office-oauth-callback.component.html',
    styleUrls: [ './office-oauth-callback.component.scss' ]
})
export class OfficeOAuthCallbackComponent implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(private nbAuthService: NbAuthService, private router: Router, private httpClient: HttpClient, private authService: AuthService) {
        this.nbAuthService.authenticate('office')
            .pipe(takeUntil(this.destroy$))
            .subscribe((authResult: NbAuthResult) => {
                if (authResult.isSuccess()) {
                    this.httpClient.get<IResponse>('/api/auth/office-jwt', {
                        withCredentials: true,
                        headers: {Authorization: 'Bearer ' + authResult.getToken().getValue()}
                    }).subscribe((_ => {
                        authService.setIsLogin(true);
                        this.router.navigateByUrl('/home');
                    }), _ => {
                        authService.setIsLogin(false);
                        this.router.navigateByUrl('/auth/login');
                    });
                } else {
                    authService.setIsLogin(false);
                    this.router.navigateByUrl('/auth/login');
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

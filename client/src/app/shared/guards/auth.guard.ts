import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NbAuthService } from '@nebular/auth';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private nbAuthService: NbAuthService, private router: Router, private authService: AuthService) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.authService.isLoggedIn()) {
            return true;
        }
        return this.nbAuthService.isAuthenticated().pipe(
            tap(authenticated => {
                if (!authenticated) {
                    this.router.navigateByUrl('/auth/login');
                }
            })
        );
    }
}

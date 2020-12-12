import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) {
    }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        if (err.status === 401) {
            this.router.navigateByUrl(`/auth/login`);
        }
        return throwError(err);
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(catchError(x => this.handleAuthError(x)));
    }
}

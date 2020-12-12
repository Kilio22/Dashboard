import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { NbAuthService } from '@nebular/auth';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-office-oauth',
    templateUrl: './office-oauth.component.html',
    styleUrls: [ './office-oauth.component.scss' ]
})
export class OfficeOAuthComponent implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(private authService: NbAuthService) {
        this.login();
    }

    login(): void {
        this.authService.authenticate('office')
            .pipe(takeUntil(this.destroy$))
            .subscribe((_) => {
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}

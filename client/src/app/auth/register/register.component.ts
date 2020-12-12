import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { NB_AUTH_OPTIONS, NbAuthService, NbRegisterComponent } from '@nebular/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: [ './register.component.scss' ]
})
export class RegisterComponent extends NbRegisterComponent implements OnInit {
    constructor(service: NbAuthService, @Inject(NB_AUTH_OPTIONS) options: {}, cd: ChangeDetectorRef, router: Router, private authService: AuthService) {
        super(service, options, cd, router);
    }

    async ngOnInit(): Promise<void> {
        if (this.authService.isLoggedIn()) {
            await this.router.navigateByUrl('/auth/verify');
        }
    }
}

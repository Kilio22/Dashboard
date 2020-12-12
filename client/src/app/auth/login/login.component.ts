import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { NB_AUTH_OPTIONS, NbAuthService, NbLoginComponent } from '@nebular/auth';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

interface OAuthLogin {
    icon: IconDefinition;
    link: string;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.scss' ]
})
export class LoginComponent extends NbLoginComponent implements OnInit {
    oAuthLogins: OAuthLogin[] = [
        {
            icon: faMicrosoft,
            link: '/auth/login-office'
        }
    ];

    constructor(service: NbAuthService, @Inject(NB_AUTH_OPTIONS) options: {}, cd: ChangeDetectorRef, router: Router, private authService: AuthService) {
        super(service, options, cd, router);
    }

    async ngOnInit(): Promise<void> {
        if (this.authService.isLoggedIn()) {
            await this.router.navigateByUrl('/auth/verify');
        }
    }
}

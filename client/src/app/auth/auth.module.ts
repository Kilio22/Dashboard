import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
    NbAlertModule,
    NbButtonModule,
    NbCheckboxModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbSpinnerModule,
    NbThemeModule
} from '@nebular/theme';
import { NbAuthModule } from '@nebular/auth';
import { LoginComponent } from './login/login.component';
import { OfficeOAuthComponent } from './office-oauth/office-oauth.component';
import { OfficeOAuthCallbackComponent } from './office-oauth-callback/office-oauth-callback.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VerifyAuthComponent } from './verify-auth/verify-auth.component';
import { RegisterComponent } from './register/register.component';

/**
 * The Auth module
 *
 * Declares all Auth components and imports all necessary modules.
 */
@NgModule({
    declarations: [
        LoginComponent,
        OfficeOAuthComponent,
        OfficeOAuthCallbackComponent,
        VerifyAuthComponent,
        RegisterComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NbAlertModule,
        NbInputModule,
        NbButtonModule,
        NbCheckboxModule,
        NbLayoutModule,
        NbIconModule,
        NbThemeModule,
        NbAuthModule,
        NbSpinnerModule,
        FontAwesomeModule
    ]
})
export class AuthModule {
}

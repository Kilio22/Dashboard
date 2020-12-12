import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NbAuthComponent, NbLogoutComponent } from '@nebular/auth';
import { AuthGuard } from './shared/guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { OfficeOAuthComponent } from './auth/office-oauth/office-oauth.component';
import { OfficeOAuthCallbackComponent } from './auth/office-oauth-callback/office-oauth-callback.component';
import { VerifyAuthComponent } from './auth/verify-auth/verify-auth.component';
import { RegisterComponent } from './auth/register/register.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [ AuthGuard ]
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
        canActivate: [ AuthGuard ]
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [ AuthGuard ]
    },
    {
        path: 'auth',
        component: NbAuthComponent,
        children: [
            {
                path: '',
                component: LoginComponent
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'login-office',
                component: OfficeOAuthComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'logout',
                component: NbLogoutComponent
            },
            {
                path: 'callback',
                component: OfficeOAuthCallbackComponent
            },
            {
                path: 'verify',
                component: VerifyAuthComponent
            }
        ]
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {
}

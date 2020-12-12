import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbMenuModule, NbSidebarModule, NbThemeModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
    NbAuthJWTToken,
    NbAuthModule,
    NbOAuth2AuthStrategy,
    NbOAuth2ResponseType,
    NbPasswordAuthStrategy
} from '@nebular/auth';
import { AuthGuard } from './shared/guards/auth.guard';
import { AuthModule } from './auth/auth.module';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { HomeModule } from './home/home.module';
import { NotFoundModule } from './not-found/not-found.module';
import { UsersModule } from './users/users.module';

/**
 * The App module.
 *
 * Imports and configures everything required by the app.
 */
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NbThemeModule.forRoot({name: 'corporate'}),
        NbSidebarModule.forRoot(),
        NbMenuModule.forRoot(),
        NbEvaIconsModule,
        NbAuthModule.forRoot({
            strategies: [
                NbPasswordAuthStrategy.setup({
                    name: 'email',
                    token: {
                        class: NbAuthJWTToken,
                        key: 'token'
                    },
                    baseEndpoint: '/api',
                    login: {
                        endpoint: '/auth/sign-in',
                        redirect: {
                            success: '/home',
                            failure: null
                        }
                    },
                    register: {
                        endpoint: '/auth/sign-up',
                        redirect: {
                            success: '/home',
                            failure: null
                        }
                    },
                    logout: {
                        endpoint: '/auth/sign-out'
                    }
                }),
                NbOAuth2AuthStrategy.setup({
                    name: 'office',
                    clientId: 'YOUR_CLIENT_ID_HERE',
                    authorize: {
                        endpoint: 'YOUR_AUTHORIZE_ENDPOINT_HERE',
                        responseType: NbOAuth2ResponseType.TOKEN,
                        scope: 'YOUR_SCOPE',
                        redirectUri: environment.thisUrl + '/auth/callback'
                    }
                })
            ],
            forms: {
                register: {
                    terms: false
                }
            }
        }),
        HomeModule,
        AuthModule,
        NotFoundModule,
        UsersModule
    ],
    providers: [
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useFactory: (router: Router) => {
                return new AuthInterceptor(router);
            },
            multi: true,
            deps: [ Router ]
        }
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule {
}

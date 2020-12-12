import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { VerifyAuthComponent } from './verify-auth.component';
import { NbSpinnerModule } from '@nebular/theme';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

const authServiceMock = jasmine.createSpyObj('AuthService', [ 'setIsLogin' ]);

describe('VerifyAuthComponent', () => {
    let component: VerifyAuthComponent;
    let fixture: ComponentFixture<VerifyAuthComponent>;
    let httpTestingController: HttpTestingController;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ VerifyAuthComponent ],
            imports: [ HttpClientTestingModule, NbSpinnerModule, RouterTestingModule.withRoutes([]) ],
            providers: [ { provider: AuthService, useValue: authServiceMock } ]
        })
                     .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VerifyAuthComponent);
        component = fixture.componentInstance;
        httpTestingController = TestBed.inject(HttpTestingController);
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should redirect to home if ping succeeds.', () => {
        const req = httpTestingController.expectOne('/api/auth/ping');
        const navSpy = spyOn(router, 'navigateByUrl');

        expect(req.request.method).toEqual('GET');
        req.flush('true');
        expect(navSpy).toHaveBeenCalledWith('/home');
    });
});

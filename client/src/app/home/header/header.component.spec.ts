import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import {
    NbActionsModule,
    NbContextMenuModule,
    NbIconModule,
    NbMenuModule,
    NbSidebarModule,
    NbSidebarService,
    NbThemeModule,
    NbUserModule
} from '@nebular/theme';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardService } from '../../shared/services/dashboard.service';
import { of } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HttpResponse } from '@angular/common/http';
import { User } from '../../shared/interfaces/user';

const dashboardServiceMock = jasmine.createSpyObj('DashboardService', [ 'getUserProfile' ]);

const userMock: User = { email: 'checked@check.com', displayName: 'Check' };
const getUserProfileMock: HttpResponse<User> = new HttpResponse<User>({ body: userMock });

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let dashboardService: DashboardService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ HeaderComponent ],
            imports: [
                NbThemeModule.forRoot({ name: 'corporate' }),
                HttpClientTestingModule,
                NbActionsModule,
                NbUserModule,
                NbSidebarModule,
                NbIconModule,
                NbMenuModule.forRoot(),
                NbContextMenuModule,
                FontAwesomeModule,
                NbEvaIconsModule
            ],
            providers: [ NbSidebarService, { provider: DashboardService, useValue: dashboardServiceMock } ]
        })
                     .compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        dashboardService = TestBed.inject(DashboardService);
    });

    it('should create', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('should display user email when connected', () => {
        const getUserProfileSpy = spyOn(dashboardService, 'getUserProfile').and.returnValue(of(getUserProfileMock));

        fixture.detectChanges();

        expect(getUserProfileSpy.calls.any()).toBe(true);
        expect(component.userInfo).toBe(userMock);
    });
});

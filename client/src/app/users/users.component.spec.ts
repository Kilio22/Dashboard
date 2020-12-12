import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { NbLayoutModule, NbMenuModule, NbSidebarModule, NbSpinnerModule, NbThemeModule } from '@nebular/theme';
import { HomeModule } from '../home/home.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('UsersComponent', () => {
    let component: UsersComponent;
    let fixture: ComponentFixture<UsersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ UsersComponent ],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                NbThemeModule.forRoot({ name: 'corporate' }),
                NbSidebarModule.forRoot(),
                NbMenuModule.forRoot(),
                NbLayoutModule,
                NbSpinnerModule,
                HomeModule
            ]
        })
                     .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UsersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

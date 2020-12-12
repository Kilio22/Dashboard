import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherComponent } from './weather.component';
import { NbSpinnerModule } from '@nebular/theme';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const dashboardServiceMock = jasmine.createSpyObj('DashboardService', [ 'isRedditLogged' ]);

describe('WeatherComponent', () => {
    let component: WeatherComponent;
    let fixture: ComponentFixture<WeatherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ WeatherComponent ],
            imports: [ HttpClientTestingModule, NbSpinnerModule ],
            providers: [ { provider: DashboardService, useValue: dashboardServiceMock } ]
        })
                     .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WeatherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

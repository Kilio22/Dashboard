import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TtvUserWatcherComponent } from './ttv-user-watcher.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NbSpinnerModule } from '@nebular/theme';
import { DashboardService } from '../../../../shared/services/dashboard.service';

const dashboardServiceMock = jasmine.createSpyObj('DashboardService', [ 'isRedditLogged' ]);

describe('TtvUserWatcherComponent', () => {
    let component: TtvUserWatcherComponent;
    let fixture: ComponentFixture<TtvUserWatcherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ TtvUserWatcherComponent ],
            imports: [ HttpClientTestingModule, NbSpinnerModule ],
            providers: [ { provider: DashboardService, useValue: dashboardServiceMock } ]
        })
                     .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TtvUserWatcherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

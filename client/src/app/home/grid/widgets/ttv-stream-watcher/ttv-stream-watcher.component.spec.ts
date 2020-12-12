import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TtvStreamWatcherComponent } from './ttv-stream-watcher.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NbSpinnerModule } from '@nebular/theme';
import { DashboardService } from '../../../../shared/services/dashboard.service';

const dashboardServiceMock = jasmine.createSpyObj('DashboardService', [ 'isRedditLogged' ]);

describe('TtvStreamWatcherComponent', () => {
    let component: TtvStreamWatcherComponent;
    let fixture: ComponentFixture<TtvStreamWatcherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ TtvStreamWatcherComponent ],
            imports: [ HttpClientTestingModule, NbSpinnerModule ],
            providers: [ { provider: DashboardService, useValue: dashboardServiceMock } ]
        })
                     .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TtvStreamWatcherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

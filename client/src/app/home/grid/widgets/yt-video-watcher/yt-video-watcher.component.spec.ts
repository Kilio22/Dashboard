import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YtVideoWatcherComponent } from './yt-video-watcher.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { NbSpinnerModule } from '@nebular/theme';

const dashboardServiceMock = jasmine.createSpyObj('DashboardService', [ 'isRedditLogged' ]);

describe('YtVideoWatcherComponent', () => {
    let component: YtVideoWatcherComponent;
    let fixture: ComponentFixture<YtVideoWatcherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ YtVideoWatcherComponent ],
            imports: [ HttpClientTestingModule, NbSpinnerModule ],
            providers: [ { provider: DashboardService, useValue: dashboardServiceMock } ]
        })
                     .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(YtVideoWatcherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

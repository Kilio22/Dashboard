import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YtChannelWatcherComponent } from './yt-channel-watcher.component';
import { NbSpinnerModule } from '@nebular/theme';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const dashboardServiceMock = jasmine.createSpyObj('DashboardService', [ 'isRedditLogged' ]);

describe('YtSubscriberCountComponent', () => {
    let component: YtChannelWatcherComponent;
    let fixture: ComponentFixture<YtChannelWatcherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ YtChannelWatcherComponent ],
            imports: [ HttpClientTestingModule, NbSpinnerModule ],
            providers: [ { provider: DashboardService, useValue: dashboardServiceMock } ]
        })
                     .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(YtChannelWatcherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

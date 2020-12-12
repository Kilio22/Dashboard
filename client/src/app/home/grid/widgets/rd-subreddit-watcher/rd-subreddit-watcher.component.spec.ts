import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdSubredditWatcherComponent } from './rd-subreddit-watcher.component';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { NbSpinnerModule } from '@nebular/theme';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const dashboardServiceMock = jasmine.createSpyObj('DashboardService', [ 'isRedditLogged' ]);

describe('RdSubredditWatcherComponent', () => {
    let component: RdSubredditWatcherComponent;
    let fixture: ComponentFixture<RdSubredditWatcherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ RdSubredditWatcherComponent ],
            imports: [ HttpClientTestingModule, NbSpinnerModule ],
            providers: [ { provider: DashboardService, useValue: dashboardServiceMock } ]
        })
                     .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RdSubredditWatcherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

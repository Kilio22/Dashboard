import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { GridComponent } from './grid.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardService } from '../../shared/services/dashboard.service';
import { GridService } from './grid.service';
import { GridsterModule } from 'angular-gridster2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NbPopoverModule, NbThemeModule } from '@nebular/theme';
import { UUID } from 'angular2-uuid';
import { WidgetConfig } from '../../shared/interfaces/widget-config';
import { of } from 'rxjs';

const dashboardServiceMock = jasmine.createSpyObj<DashboardService>('DashboardService', [ 'getWidgetsConfig' ]);

const widgetConfigMock: WidgetConfig[] = [ {
    id: UUID.UUID(),
    type: 'msMail',
    x: 0,
    y: 0,
    refreshRate: 5,
    query: '',
}, {
    id: UUID.UUID(),
    type: 'msCalendar',
    x: 0,
    y: 0,
    refreshRate: 5,
    query: '',
}, {
    id: UUID.UUID(),
    type: 'rdSubredditWatcher',
    x: 0,
    y: 0,
    refreshRate: 5,
    query: '',
} ];

describe('GridComponent', () => {
    let component: GridComponent;
    let fixture: ComponentFixture<GridComponent>;
    let gridService: GridService;
    let dashboardService: DashboardService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ GridComponent ],
            imports: [
                NbThemeModule.forRoot({ name: 'corporate' }),
                HttpClientTestingModule,
                GridsterModule,
                FontAwesomeModule,
                NbPopoverModule
            ],
            providers: [ { provider: DashboardService, useValue: dashboardServiceMock } ]
        })
                     .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GridComponent);
        component = fixture.componentInstance;
        gridService = TestBed.inject(GridService);
        dashboardService = TestBed.inject(DashboardService);
    });

    it('should create', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('should add grid items from config', () => {
        const getWidgetsConfigSpy = spyOn(dashboardService, 'getWidgetsConfig').and.returnValue(of(widgetConfigMock));
        const addItemSpy = spyOn(component, 'addItem');

        fixture.detectChanges();

        expect(getWidgetsConfigSpy.calls.any()).toBe(true);
        expect(addItemSpy.calls.count()).toBe(widgetConfigMock.length);
    });
});

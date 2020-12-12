import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MsCalendarComponent } from './ms-calendar.component';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NbOptionModule, NbSelectModule, NbSpinnerModule, NbThemeModule } from '@nebular/theme';
import { UUID } from 'angular2-uuid';
import { of } from 'rxjs';
import { Authenticated } from '../../../../shared/interfaces/authenticated';
import { MicrosoftCalendar } from '../../../../shared/interfaces/microsoft-calendar';
import { WidgetConfig } from '../../../../shared/interfaces/widget-config';
import { MicrosoftCalendarEvent } from '../../../../shared/interfaces/microsoft-calendar-event';

const dashboardServiceMock = jasmine.createSpyObj<DashboardService>('DashboardService',
    [ 'isMicrosoftLogged', 'getMicrosoftCalendars', 'getWidgetConfig', 'getMicrosoftCalendarEvents' ]);
const authenticatedMock: Authenticated = { authenticated: true };
const widgetConfigMock: WidgetConfig = { id: 'check', query: 'randomId1', refreshRate: 10, type: '.', x: 2, y: 11 };
const microsoftCalendarsMock: MicrosoftCalendar[] = [ { id: 'randomId1', name: 'calendar1' },
    { id: 'randomId2', name: 'calendar2' },
    { id: 'randomId3', name: 'calendar3' } ];
const microsoftCalendarEventsMock: MicrosoftCalendarEvent[] = [ {
    id: 'randomEventId1',
    subject: 'fart',
    start: { dateTime: '', timeZone: '' },
    end: { dateTime: '', timeZone: '' }
} ];

describe('MsCalendarComponent', () => {
    let component: MsCalendarComponent;
    let fixture: ComponentFixture<MsCalendarComponent>;
    let dashboardService: DashboardService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ MsCalendarComponent ],
            imports: [ HttpClientTestingModule, NbThemeModule.forRoot({ name: 'corporate' }), NbSpinnerModule, NbSelectModule ],
            providers: [ { provider: DashboardService, useValue: dashboardServiceMock } ]
        })
                     .compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(MsCalendarComponent);
        component = fixture.componentInstance;
        component.id = UUID.UUID();
        component.setRefreshRate(1000);
        dashboardService = TestBed.inject(DashboardService);
    });

    it('should create', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('should load events if calendar was selected in config', async () => {
        const isMicrosoftLoggedSpy = spyOn(dashboardService, 'isMicrosoftLogged').and.returnValue(of(authenticatedMock));
        const getWidgetConfigSpy = spyOn(dashboardService, 'getWidgetConfig').and.returnValue(of(widgetConfigMock));
        const getMicrosoftCalendarsSpy = spyOn(dashboardService, 'getMicrosoftCalendars').and.returnValue(of(microsoftCalendarsMock));
        const getMicrosoftCalendarEventsSpy = spyOn(dashboardService, 'getMicrosoftCalendarEvents').and.returnValue(of(microsoftCalendarEventsMock));
        spyOn(component, 'repeatFetchCalendarList'); // Need to cancel those otherwise fixture.whenStable() hangs
        spyOn(component, 'repeatFetchEventList');    //

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(component.eventList).toBe(microsoftCalendarEventsMock);
        expect(isMicrosoftLoggedSpy.calls.count()).toBe(1);
        expect(getWidgetConfigSpy.calls.count()).toBe(1);
        expect(getMicrosoftCalendarsSpy.calls.count()).toBe(1);
        expect(getMicrosoftCalendarEventsSpy.calls.count()).toBe(1);
    });
});

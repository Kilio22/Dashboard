import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MsMailComponent } from './ms-mail.component';
import { NbSelectModule, NbSpinnerModule, NbThemeModule } from '@nebular/theme';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { Authenticated } from '../../../../shared/interfaces/authenticated';
import { WidgetConfig } from '../../../../shared/interfaces/widget-config';
import { UUID } from 'angular2-uuid';
import { of } from 'rxjs';
import { MicrosoftMailbox } from '../../../../shared/interfaces/microsoft-mailbox';
import { MicrosoftMail } from '../../../../shared/interfaces/microsoft-mail';

const dashboardServiceMock = jasmine.createSpyObj<DashboardService>('DashboardService',
    [ 'isMicrosoftLogged', 'getWidgetConfig', 'getMicrosoftMailboxes', 'getMicrosoftMails' ]);
const authenticatedMock: Authenticated = { authenticated: true };
const widgetConfigMock: WidgetConfig = { id: 'check', query: 'randomId1', refreshRate: 10, type: '.', x: 2, y: 11 };
const microsoftMailboxMock: MicrosoftMailbox[] = [ { id: 'randomId1', displayName: 'mailbox1', unreadItemCount: 0 },
    { id: 'randomId2', displayName: 'mailbox2', unreadItemCount: 0 },
    { id: 'randomId3', displayName: 'mailbox3', unreadItemCount: 0 } ];
const microsoftMailsMock: MicrosoftMail[] = [ {
    id: 'randomEventId1',
    receivedDateTime: '',
    subject: 'fart',
    isRead: false,
    webLink: 'zombo.com',
    sender: { emailAddress: { address: 'Hugo' } },
} ];

describe('MsMailComponent', () => {
    let component: MsMailComponent;
    let fixture: ComponentFixture<MsMailComponent>;
    let dashboardService: DashboardService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ MsMailComponent ],
            imports: [ HttpClientTestingModule, NbThemeModule.forRoot({ name: 'corporate' }), NbSpinnerModule, NbSelectModule ],
            providers: [ { provider: DashboardService, useValue: dashboardServiceMock } ]
        })
                     .compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(MsMailComponent);
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

    it('should load mails if mailbox was selected in config', async () => {
        const isMicrosoftLoggedSpy = spyOn(dashboardService, 'isMicrosoftLogged').and.returnValue(of(authenticatedMock));
        const getWidgetConfigSpy = spyOn(dashboardService, 'getWidgetConfig').and.returnValue(of(widgetConfigMock));
        const getMicrosoftMailboxesSpy = spyOn(dashboardService, 'getMicrosoftMailboxes').and.returnValue(of(microsoftMailboxMock));
        const getMicrosoftMailsSpy = spyOn(dashboardService, 'getMicrosoftMails').and.returnValue(of(microsoftMailsMock));
        spyOn(component, 'repeatFetchMailboxList'); // Need to cancel those otherwise fixture.whenStable() hangs
        spyOn(component, 'repeatFetchMailList');    //

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(component.mailList).toBe(microsoftMailsMock);
        expect(isMicrosoftLoggedSpy.calls.count()).toBe(1);
        expect(getWidgetConfigSpy.calls.count()).toBe(1);
        expect(getMicrosoftMailboxesSpy.calls.count()).toBe(1);
        expect(getMicrosoftMailsSpy.calls.count()).toBe(1);
    });
});

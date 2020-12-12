import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SpotifyArtistComponent } from './spotify-artist.component';
import {
    NbFormFieldModule,
    NbInputModule,
    NbProgressBarModule,
    NbSelectModule,
    NbSpinnerModule,
    NbThemeModule
} from '@nebular/theme';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { of } from 'rxjs';
import { UUID } from 'angular2-uuid';
import { FormsModule, NgForm } from '@angular/forms';
import { NbEvaIconsModule } from '@nebular/eva-icons';

const dashboardServiceNotAuthenticatedMock = jasmine.createSpyObj('DashboardService', [ 'isSpotifyLogged' ]);
dashboardServiceNotAuthenticatedMock.isSpotifyLogged.and.returnValue(of({ authenticated: false }));

const dashboardServiceAuthenticatedNoConfigMock = jasmine.createSpyObj('DashboardService',
    [ 'isSpotifyLogged', 'getWidgetConfig', 'saveQueryConfig', 'getSpotifyArtist' ]);
dashboardServiceAuthenticatedNoConfigMock.isSpotifyLogged.and.returnValue(of({ authenticated: true }));
dashboardServiceAuthenticatedNoConfigMock.getWidgetConfig.and.returnValue(of({
    id: '',
    refreshRate: 0,
    type: '',
    x: 0,
    y: 0,
    query: ''
}));
dashboardServiceAuthenticatedNoConfigMock.saveQueryConfig.and.returnValue(of(null));
dashboardServiceAuthenticatedNoConfigMock.getSpotifyArtist.and.returnValue(of({
    id: UUID.UUID(),
    name: 'Test',
    popularity: 50,
    genres: [ 'check' ],
    followers: 10,
    image: ''
}));

describe('SpotifyArtistComponent', () => {

    describe('when not authenticated', () => {
        let component: SpotifyArtistComponent;
        let fixture: ComponentFixture<SpotifyArtistComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                declarations: [ SpotifyArtistComponent ],
                imports: [
                    HttpClientTestingModule,
                    NbSpinnerModule,
                    NbSelectModule,
                    NbProgressBarModule,
                    FontAwesomeModule
                ],
                providers: [ { provide: DashboardService, useValue: dashboardServiceNotAuthenticatedMock } ]
            })
                         .compileComponents();
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(SpotifyArtistComponent);
            component = fixture.componentInstance;
            component.id = UUID.UUID();
            component.setRefreshRate(1000);
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should display login button if not authenticated', () => {
            const element: HTMLElement = fixture.nativeElement;
            const notConnectedDiv = element.querySelector('#not-connected-div');

            expect(notConnectedDiv).toBeTruthy();
        });
    });

    describe('when authenticated without config', () => {
        let component: SpotifyArtistComponent;
        let fixture: ComponentFixture<SpotifyArtistComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                declarations: [ SpotifyArtistComponent ],
                imports: [
                    NbThemeModule.forRoot({ name: 'corporate' }),
                    HttpClientTestingModule,
                    FormsModule,
                    NbSpinnerModule,
                    NbFormFieldModule,
                    NbInputModule,
                    NbSelectModule,
                    NbProgressBarModule,
                    FontAwesomeModule,
                    NbEvaIconsModule
                ],
                providers: [ { provide: DashboardService, useValue: dashboardServiceAuthenticatedNoConfigMock } ]
            })
                         .compileComponents();
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(SpotifyArtistComponent);
            component = fixture.componentInstance;
            component.id = UUID.UUID();
            component.setRefreshRate(1000);
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should display artist-id-form not display current-artist-div', () => {
            const element: HTMLElement = fixture.nativeElement;
            const artistIdForm: HTMLFormElement = element.querySelector('#artist-id-form');
            const currentArtistDiv = element.querySelector('#current-artist-div');

            expect(artistIdForm).toBeTruthy();
            expect(currentArtistDiv).toBeFalsy();
        });

        // TODO: fucking test.
        // it('should request artist on submit', fakeAsync(() => {
        //     const element: HTMLElement = fixture.nativeElement;
        //     const artistIdForm: HTMLFormElement = element.querySelector('#artist-id-form');
        //     const currentArtistDiv = element.querySelector('#current-artist-div');
        //
        //     expect(artistIdForm).toBeTruthy();
        //     expect(currentArtistDiv).toBeTruthy();
        //
        //     const artistIdSearchInput: HTMLInputElement = artistIdForm[0];
        //
        //     artistIdSearchInput.value = 'check';
        //     artistIdForm.submit();
        //     tick();
        //     fixture.detectChanges();
        // }));

    });

});

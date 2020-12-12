import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridHeaderComponent } from './grid-header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NbDialogModule, NbDialogService, NbThemeModule } from '@nebular/theme';

const dialogServiceMock = jasmine.createSpyObj('NbDialogService', [ 'open' ]);

describe('GridHeaderComponent', () => {
    let component: GridHeaderComponent;
    let fixture: ComponentFixture<GridHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ GridHeaderComponent ],
            imports: [
                NbThemeModule.forRoot({name: 'corporate'}),
                NbDialogModule.forRoot(),
                FontAwesomeModule
            ]
        })
                     .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GridHeaderComponent);
        component = fixture.componentInstance;
        component.name = 'Check';
        component.refreshRate = 5;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

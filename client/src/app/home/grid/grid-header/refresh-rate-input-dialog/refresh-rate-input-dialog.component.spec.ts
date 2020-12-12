import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshRateInputDialogComponent } from './refresh-rate-input-dialog.component';
import { NbCardModule, NbDialogRef } from '@nebular/theme';

const dialogRefMock = jasmine.createSpyObj('NbDialogRef', [ 'close' ]);

describe('RefreshRateInputDialogComponent', () => {
    const closeSpy = dialogRefMock.close;
    let component: RefreshRateInputDialogComponent;
    let fixture: ComponentFixture<RefreshRateInputDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ RefreshRateInputDialogComponent ],
            providers: [ { provide: NbDialogRef, useValue: dialogRefMock } ],
            imports: [ NbCardModule ]
        })
                     .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RefreshRateInputDialogComponent);
        component = fixture.componentInstance;
        component.refreshRate = 5;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close on cancel', () => {
        const element: HTMLElement = fixture.nativeElement;
        const cancelButton: HTMLButtonElement = element.querySelector('#refresh-rate-cancel');

        cancelButton.click();
        expect(closeSpy.calls.any()).toBe(true);
    });
});

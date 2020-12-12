import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faArrowsAlt, faClock, faStopwatch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NbDialogService } from '@nebular/theme';
import { RefreshRateInputDialogComponent } from './refresh-rate-input-dialog/refresh-rate-input-dialog.component';

@Component({
    selector: 'app-grid-header',
    templateUrl: './grid-header.component.html',
    styleUrls: [ './grid-header.component.scss' ]
})
export class GridHeaderComponent {

    @Input() name: string;

    @Input() refreshRate: number;
    @Output() refreshRateChange = new EventEmitter<number>();

    @Output() removeClick = new EventEmitter<any>();

    icons = {
        faClock,
        faStopwatch,
        faArrowsAlt,
        faTrash
    };

    constructor(private dialogService: NbDialogService) {
    }

    onTimerClicked(): void {
        this.dialogService.open(RefreshRateInputDialogComponent, {
            context: {
                refreshRate: this.refreshRate
            }
        })
            .onClose.subscribe(newVal => {
            const num = parseInt(newVal, 10);

            if (newVal && num >= 1) {
                this.refreshRate = num;
                this.refreshRateChange.emit(this.refreshRate);
            }
        });
    }

    onTrashClicked(): void {
        this.removeClick.emit();
    }

}

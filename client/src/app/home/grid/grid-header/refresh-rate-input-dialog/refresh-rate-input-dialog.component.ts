import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
    selector: 'app-refresh-rate-input-dialog',
    templateUrl: './refresh-rate-input-dialog.component.html',
    styleUrls: [ './refresh-rate-input-dialog.component.scss' ]
})
export class RefreshRateInputDialogComponent {

    @Input() refreshRate: number;

    constructor(private ref: NbDialogRef<RefreshRateInputDialogComponent>) {
    }

    cancel(): void {
        this.ref.close();
    }

    submit(value: any): void {
        this.ref.close(value);
    }

}
